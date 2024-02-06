const { User, Quiz, Plan, Collection, Score } = require('../models')
const { Sequelize } = require('sequelize')
const { toPackage } = require('../helper/api-helper')
const { imgurFileHandler } = require('../helper/file-helper')
const { samePerson } = require('../helper/same-person-helper')
const redisClient = require('../db/redis')
const { NoPermissionError, NotFoundError, BadRequestError } = require('../middleware/errors')
require('openai/shims/node')
const { OpenAI } = require('openai')
const { getOffset, getPagination } = require('../helper/pagination-helper')


const quizService = {
    home: async(req, cb) => {
        try {
            // if have search value
            const searchValue = req.query.search
            const DEFAULT_LIMIT = 5 // 默認render一頁數量
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            if (!Number.isInteger(page) || page <= 0) return cb(new BadRequestError('Invalid page number.'))
            let data
            // no search value means no serach, should put some content when there is no search value?
            if (!searchValue) {
                data = {
                    ...toPackage('success'),
                    empty: true
                }
                return cb(null, data)
            }
            const quiz = await Quiz.findAndCountAll({
                where: {
                    question: {
                        [Sequelize.Op.like]: `%${searchValue}%`
                    }
                },
                order: [['createdAt', 'DESC']],
                include: [{model: User}],
                limit,
                offset,
                raw: true,
                nest: true
            })
            if (!quiz.rows.length) {
                if (page !== 1) return cb(new BadRequestError('Invalid page number.'))
                return cb(new NotFoundError('There is no any result.'))
            }
            quiz.rows.forEach((e) => {
                e[`${e.answer}true`] = true
            })
            data = {
                ...toPackage('success', 'quiz'),
                quiz: quiz.rows,
                count: quiz.count,
                search: searchValue,
                pagination: getPagination(limit, page, quiz.count),
                pgsetting: 'home'
            }
            return cb(null, data)
        } catch (err) {
            return cb(new Error(err))
        }
        
    },
    quizPage: async(req, cb) => {
        try {
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const quiz = await Quiz.findAndCountAll({
                where: {
                    user_id: req.user.id
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw:true,
                nest:true,
            })
            quiz.rows.forEach((e) => {
                let check = `${e.answer}true`
                e[check] = true
            })
            const result = {
                ...toPackage('success'),
                quiz: quiz.rows,
                pagination: getPagination(limit, page, quiz.count),
                pgsetting: 'quiz',
                display: quiz.count
            }
            return cb(null, result)
        } catch (err) {
            return cb(new Error('InterService Error'))
        }
    },
    aiCreateQuiz: async (req, cb) => {
        try {
            let { ai } = req.body
            const openai = new OpenAI({
                apiKey: process.env.OPEN_AI_SECRET_KEY 
            })

            const userInput = ai.trim()
            if (userInput.length === 0) return cb(new BadRequestError('Please enter the content!'))

            const messages = [
                {
                    role: 'user',
                    content: `你是個出題老師, 請給1題關於${userInput}的4選1的單選題, 並附上答案是哪個選項, 請完全使用繁體中文回答`,
                },
                {
                    role: 'system',
                    content: 'You are a helpful assistant.',
                },
            ]

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                temperature: 1,
                messages: messages,
                max_tokens: 200,
            })

            // check what gpt says, so need to console.log
            let reMessage = completion.choices[0].message.content
            console.log(reMessage)
            
            if (reMessage.includes('抱歉') || reMessage.includes('Sorry') || reMessage.includes('違法')) return cb(new NoPermissionError('AI cannot provide that kind of message to you'))

            // split gpt come back's answer into arr, and filter out empty \n
            let arr = completion.choices[0].message.content.split('\n')
            
            // check return data has some string.
            if (arr[0].includes('Thank you') || arr[0].includes('謝謝')) arr[0] = ''
            arr = arr.filter(item => item.trim() !== '')
            // defined the return data type
            let data = {
                ...toPackage('success', undefined),
            }
            let quiz = {}

            // find question, use question mark to position
            let i = 0
            const questionMarksRegex = /[？?]/
            for (i; i < arr.length; i++) {
                if (questionMarksRegex.test(arr[i])) break
            }
            quiz.question = arr[i]

            // to find the first option            
            const pattern = /([Aa]\.|[Aa]\))/
            for (i; i < arr.length; i++) {
                if (pattern.test(arr[i])) break
            }

            let check = arr[arr.length - 1]
            // record now's i position, next 4 line will be option
            let copyI = i
            let copyIAdd4 = copyI + 4

            // check the answer first, if include, then it should be answer
            for (let j = 1; j < 5; i++,j++) {
                if (check.includes(arr[i])) {
                    quiz.answer = `select${j}`
                    let select = `select${j}true`
                    data[select] = true
                    break
                }
            }

            // set the option to select 1-4
            for (let k = copyI, l = 1; k < copyIAdd4; k++, l++) {
                let temp = arr[k].split(' ')
                temp.shift()
                temp = temp.join(' ')
                quiz[`select${l}`] = temp
            }

            data.quiz = quiz
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
    },
    postQuiz: async (req, cb) => {
        try {
            let { question, select1, select2, select3, select4, answer } = req.body
            if (!question || !select1) return cb(new BadRequestError('Please fill question and at least an option.'))
            if (answer === '0') return cb(new BadRequestError('Please select the answer'))
            const quiz = await Quiz.create({
                question,
                select1,
                select2,
                select3,
                select4,
                answer,
                userId: req.user.id
            })
            const result = {
                ...toPackage('success'),
                quiz
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    editQuizPage: async (req, cb) => {
        try {
            let id = req.params.id
            let quiz = await Quiz.findByPk(id)
            if (!quiz) return cb(new NotFoundError('There is no that quiz existed.'))
            if (!samePerson(quiz.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You cannot edit other user\'s quiz.'))
            quiz = quiz.toJSON()
            let data = {
                ...toPackage('success'),
                quiz
            }
            for(const key in quiz) {
                if (key.includes(quiz.answer.toString())) {
                    let check = `${key}true`
                    data[check] = true
                }
            }
            return cb(null, data)
        } catch(err) {
            return cb(err)
        }
    },
    editQuiz: async (req, cb) => {
        try {
            let { question, select1, select2, select3, select4, answer } = req.body
            let id = req.params.id
            if (!question || !select1) return cb(new BadRequestError('Please fill question and at least an option.'))
            if (answer === '0') return cb(new BadRequestError('Please select the answer'))

            const quiz = await Quiz.findByPk(id)
            if (!samePerson(quiz.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You cannot edit other user\'s quiz.'))
            if (!quiz) return cb(new NotFoundError('There is no that quiz existed.'))
            let update = await quiz.update({
                question,
                select1,
                select2,
                select3,
                select4,
                answer
            })
            const result = {
                ...toPackage('success'),
                quiz: update.toJSON()
            }

            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    deleteQuiz: async (req, cb) => {
        try {
            let id = req.params.id
            const quiz = await Quiz.findByPk(id)
            if (!samePerson(quiz.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You cannot delete other user\'s quiz'))
            if (!quiz) return cb(new NotFoundError('There is no that quiz existed.'))
            await quiz.destroy()
            const result = {
                ...toPackage('success'),
                quiz: quiz.toJSON()
            }
            return cb(null, result)
        } catch(err) {
            return cb(err)
        }
    },
    planPage: async (req, cb) => {
        try {
            const id = req.user.id
            const DEFAULT_LIMIT = 9
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            let [plan, user] = await Promise.all([
                Plan.findAndCountAll({
                    where: {
                        userId: id
                    },
                    order: [['createdAt', 'DESC']],
                    limit,
                    offset,
                    raw: true,
                    nest: true
                }),
                User.findByPk(id, {
                    include: [{model: Plan}]
                })
            ])
            user = user.toJSON()
            let result = {
                ...toPackage('success'),
                plan: plan.rows,
                user,
                pagination: getPagination(limit, page, plan.count),
                pgsetting: 'plan',
                display: plan.count
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    postPlan: async (req, cb) => {
        try {
            let { name } = req.body
            const id = req.user.id
            const plan = await Plan.create({
                name,
                userId:id
            })
            const result = {
                ...toPackage('success'),
                plan: plan.toJSON()
            }

            cb(null, result)

            try {
                const reply = await new Promise((resolve, reject) => {
                    redisClient.get(id, (err, reply) => {
                        if (err) reject(err)
                        else resolve(reply)
                    })
                })
            
                if (!reply) return cb(new NotFoundError('There is no this user information in the database.'), null)
                let user = JSON.parse(reply)

                const userPlan = user.plan
                userPlan.unshift({ 'id': plan.id, 'name': plan.name })
                user.plan = userPlan

                await new Promise((resolve, reject) => {
                    redisClient.set(user.id, JSON.stringify(user), (err) => {
                        if (err) reject(err)
                        else resolve()
                    })
                })
            } catch (error) {
                console.error('Redis 操作錯誤:', error)
            }
            
            return 
        } catch (err) {
            return cb(err)
        }
    },
    deletePlan: async (req, cb) => {
        try {
            const id = req.params.id
            let [plan, user] = await Promise.all([
                Plan.findByPk(id),
                User.findByPk(req.user.id)
            ])
            if (!plan) return cb(new NotFoundError('There is no this plan in the database.'))
            if (!samePerson(plan.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You can not delete other user\'s plan.'))
            if (user.planId === Number(id)) {
                await user.update({
                    planId: null
                })
            }
            await plan.destroy()
            const result = {
                ...toPackage('success'),
                update: plan.toJSON()
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    changeDefaultFolder: async (req, cb) => {
        try {
            const userId = req.user.id
            const id = req.params.id
            console.log(id)
            // database redis update
            const reply = await new Promise((resolve, reject) => {
                redisClient.get(`userId:${userId}`, (err, reply) => {
                    if (err) reject(err)
                    else resolve(reply)
                })
            })
            if (!reply) return cb(new NotFoundError('There is no this user information in the database.'), null)
            let user = JSON.parse(reply)
            user.Plan.id = Number(id)
            console.log(user)

            await new Promise((resolve, reject) => {
                redisClient.set(`userId:${userId}`, JSON.stringify(reply), (err) => {
                    if (err) reject(err)
                    else resolve()
                })
            })

            // database postgresql update
            const check = await User.findByPk(userId)
            if(!check) return cb(new NotFoundError('There is no this plan.'))
            await check.update({
                planId: id
            })

            // goto controller
            const result = {
                ...toPackage('success'),
                user
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    singlePlanPage: async (req, cb) => {
        try {
            const id = req.params.id
            const plan = await Plan.findByPk(id, {
                include: [{
                  model: Quiz,
                  as: 'PlanCollectToQuiz',
                }],
            })        
            if (!plan) return cb(new NotFoundError('There is no this plan existed.'))
            if (!samePerson(plan.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You cannot check other\'s plan.'))
            let deal =  plan.toJSON()
            if (!deal.PlanCollectToQuiz.length) return cb(new NotFoundError('There is no quiz in this plan.'))
            for (let i of deal.PlanCollectToQuiz) {
                delete i.Collection
                const check = i.answer
                i[`${check}true`] = true
            }
            const result = {
                ...toPackage('success'),
                plan: deal
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    singlePlanDeleteQuiz: async (req, cb) => {
        try {
            const quizId = req.params.id
            const planId = req.body.planId
            const [find, findAll]= await Promise.all([
                Collection.findOne({
                    where:{
                        quizId,
                        planId
                    }
                }),
                Collection.findAll({
                    where:{
                        planId,
                        userId: req.user.id
                    },
                    raw: true
                }),
            ])
            
            if (!find) return cb(new NotFoundError('There is no quiz in the plan'))
            find.destroy()
            let result = {
                ...toPackage('success'),
                quiz: find.toJSON(),
                quizLength: findAll.length - 1,
                planId
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    quizAddToPlan: async (req, cb) => {
        try {
            const quizId = req.params.id
            const planId = req.user.planId
            const userId = req.user.id
            console.log(quizId)
            console.log(planId)
            console.log(userId)
            const find = await Collection.findOne({
                where:{
                    quizId,
                    planId,
                    userId
                }
            })
            console.log(find.toJSON())
            if (find) return cb(new NoPermissionError('Already collect it in the default folder.'))
            const create = await Collection.create({
                quizId,
                planId,
                userId
            })
            const result = {
                ...toPackage('success'),
                collection: create
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    test: async (req, cb) => {
        try {
            const planId = req.params.id

            let plan = await Plan.findByPk(planId, {
                include: [{
                model: Quiz,
                as: 'PlanCollectToQuiz',
                attributes:['id','question','select1','select2','select3','select4','answer']
                }],
            })
            if(!samePerson(plan.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You cannot use other\'s test plan.'))
            if (!plan.PlanCollectToQuiz.length) return cb(new NotFoundError('There is no quiz in this plan.'))
            plan = plan.toJSON()
            plan.PlanCollectToQuiz[0]['first'] = true
            plan.PlanCollectToQuiz.map((e) => {
                delete e.Collection
                if (!e.select1.trim()) delete e.select1
                if (!e.select2.trim()) delete e.select2
                if (!e.select3.trim()) delete e.select3
                if (!e.select4.trim()) delete e.select4
            })
            const result = {
                ...toPackage('success'),
                quiz : plan.PlanCollectToQuiz,
                plan: {
                    id: plan.id
                }
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    postTest: async (req, cb) => {
        try {
            let data = req.body
            const planId = req.params.id
            const userId = req.user.id
            let plan = await Plan.findByPk(planId, {
                include: [{
                model: Quiz,
                as: 'PlanCollectToQuiz',
                attributes:['id','question','select1','select2','select3','select4','answer']
                }],
            })
            if (!plan) return cb(new NotFoundError('There is no this plan.'))
            plan = plan.toJSON()
            let arr = []
            for (let i in data) arr[Number(i) - 1] = data[i]
            let check = plan.PlanCollectToQuiz
            let l = check.length
            let count = 0
            // ansStr is all the quiz real answer
            // inputStr is user's all quiz's input
            // allQuizId is all the quiz's id
            // correct is to record the quiz is correct or not
            let allQuizAnswer = ''
            let allUserAnswer = ''
            let allQuizId = ''
            let correct = ''
            for (let i = 0; i < l; i++) {
                let realAnswer = check[i].answer
                let rl = realAnswer.length - 1
                let userAnswer = arr[i]
                let ul
                if (userAnswer) {
                    ul = userAnswer.length - 1
                }
                
                if (realAnswer === userAnswer) count++
                correct += (realAnswer === userAnswer) ? '1' : '0'
                allQuizAnswer += check[i].answer[rl]
                allUserAnswer += arr[i] ? arr[i][ul] : '0'
                allQuizId += `${check[i].id},`
            }
            let score = count * 100 / l
            score = Number(score.toFixed(2))
            let result = await Score.create({
                score,
                planId,
                userId,
                allQuizAnswer,
                allUserAnswer,
                allQuizId,
                correct
            })
            result = {
                ...toPackage('success'),
                result
            }

            req.flash('success_msg',`Test Plan (${plan.name}) , Total score: ${score.toFixed(2)}`)
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
        
    },
    resultPage: async (req, cb) => {
        try {
            const userId = req.user.id
            const DEFAULT_LIMIT = 5
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            let result = await Score.findAndCountAll({
                where:{
                    userId
                },
                include: [{
                    model: Plan,
                    attributes: ['id','name']
                }],
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: true,
                nest: true
            }) 
            let score = {
                ...toPackage('success'),
                score: result.rows,
                pagination: getPagination(limit, page, result.count),
                pgsetting: 'result',
                display: result.count
            }
            return cb(null, score)
        } catch (err) {
            return cb(err)
        }
    },
    deleteResult: async (req, cb) => {
        try {
            const id = req.params.id
            const find = await Score.findByPk(id)
            if (!samePerson(find.dataValues.userId, req.user.id)) return cb(new NoPermissionError('You can not check another people test result.'))
            await find.destroy()

            let result = {
                ...toPackage('sccuess'),
                score: find.toJSON()
            }

            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    resultSinglePage: async (req, cb) => {
        try {
            const id = req.params.id
            const find = await Score.findByPk(id,{
                raw: true,
            })
            if (!samePerson(find.userId, req.user.id)) return cb(new NoPermissionError('You can not check another people test result.'))
            const quizId = find.allQuizId
            const userAnswer = find.allUserAnswer
            let quizArr = quizId.split(',')
            quizArr.pop()
            let userArr = userAnswer.split('')
            let quiz = await Quiz.findAll({
                where: {
                    id: {
                        [Sequelize.Op.in]: quizArr
                    }
                },
                order: [
                    Sequelize.literal(`ARRAY_POSITION(ARRAY[${quizArr.join(',')}], id)`)
                    // Sequelize.literal(`FIELD(id, ${quizArr.join(',')})`) // 使用 FIELD 函數按照指定順序排序
                ],
                raw: true, 
                nest: true
            })
            let back = quiz.length - 1
            // since there might be some quiz be deleted, so need to check. If quiz is shorter than quizArr, means there
            // are some quiz be deleted. So it will check quizArr[i] is equal to quiz's last element, if equal, means
            // it's real, so change position to last; however, if not equal, means that quiz had been deleted, so we  
            // will give this id's quiz a message show this quiz is deleted. Use the loop is to fill the deleted 
            // quiz's blank
            for (let i = quizArr.length - 1; i >= 0; i--) {
                let t = quiz[back]
                if (t && Number(quizArr[i]) === t.id) {
                    t[`${t.answer}true`] = true
                    let user = userArr[i]
                    t[`userSelect${user}`] = true
                    ;[quiz[back],quiz[i]] = [{}, t]
                    back--
                } else {
                    quiz[i] = {
                        id: i - 1,
                        'notSelect' : true
                    }
                }
            }
            let result = {
                score: find, 
                quiz: quiz,
                ...toPackage('sccuess')
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    userInfoPage: async (req, cb) => {
        try {
            const data = {
                ...toPackage('success'),
                user: req.user
            }
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
    },
    userEditPage: async (req, cb) => {
        try {
            let id = Number(req.params.id)
            if (!samePerson(id, req.user.id)) return cb(new NoPermissionError('You can not check another people test result.'))
            const data = {
                ...toPackage('success','edit'),
                user: req.user
            }
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
        
    },
    putUserInfo: async (req, cb) => {
        try {
            const { name, description } = req.body
            const { file } = req
            const id = req.user.id
            const [check, filePath] = await Promise.all([
                User.findByPk(id),
                imgurFileHandler(file)
            ])
            await check.update({
                name: name || check.name,
                image: filePath || check.image,
                description: description || check.description
            })
            const result = {
                ...toPackage('success'),
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    }
}

module.exports = quizService