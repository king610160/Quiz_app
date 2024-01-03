const { User, Quiz, Plan, Collection, Score } = require('../models')
const { Sequelize } = require('sequelize')
const { toPackage } = require('../helper/api-helper')

const quizService = {
    home: async(req, cb) => {
        // if have search value
        const searchValue = req.query.search
        let data
        if (!searchValue) {
            data = {
                ...toPackage('success'),
                empty: true
            }
            return cb(null, data)
        }
        const quiz = await Quiz.findAll({
            where: {
                question: {
                    [Sequelize.Op.like]: `%${searchValue}%`
                }
            },
            raw: true,
            nest: true
        })
        if (!quiz.length) return cb(new Error('There is no any result.'))
        quiz.forEach((e) => {
            e[`${e.answer}true`] = true
        })

        data = {
            ...toPackage('success', 'quiz'),
            quiz: quiz,
        }
        return cb(null, data)
    },
    quizPage: async(req, cb) => {
        const quiz = await Quiz.findAll({
            where: {
                user_id: req.user.id
            },
            raw:true,
            nest:true,
        })
        quiz.forEach((e) => {
            let check = `${e.answer}true`
            e[check] = true
        })
        const result = {
            ...toPackage('success'),
            quiz: quiz
        }
        return cb(null, result)
    },
    postQuiz: async (req, cb) => {
        let { question, select1, select2, select3, select4, answer } = req.body
        if (!question || !select1) return cb(new Error('Please fill question and at least an option.'))
        if (answer === '0') return cb(new Error('Please select the answer'))
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
    },
    editQuizPage: async (req, cb) => {
        let id = req.params.id
        let quiz = await Quiz.findByPk(id)
        if (!quiz) return cb(new Error('There is no that quiz existed.'))
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
    },
    editQuiz: async (req, cb) => {
        let { question, select1, select2, select3, select4, answer } = req.body
        let id = req.params.id
        if (!question || !select1) throw new Error('Please fill question and at least an option.')
        if (answer === '0') throw new Error('Please select the answer')

        const quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
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
    },
    deleteQuiz: async (req, cb) => {
        let id = req.params.id
        const quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
        await quiz.destroy()
        const result = {
            ...toPackage('success'),
            quiz: quiz.toJSON()
        }
        return cb(null, result)
    },
    planPage: async (req, cb) => {
        const id = req.user.id
        let [plan, user] = await Promise.all([
            Plan.findAll({
                where: {
                    userId: id
                },
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
            plan,
            user
        }

        return cb(null, result)
    },
    postPlan: async (req, cb) => {
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
        return cb(null, result)
    },
    deletePlan: async (req, cb) => {
        const id = req.params.id
        let plan = await Plan.findByPk(id)
        if(!plan) return cb(new Error('There is no this plan in the database.'))
        await plan.destroy()
        const result = {
            ...toPackage('success'),
            plan: plan.toJSON()
        }
        return cb(null, result)
    },
    changeDefaultFolder: async (req, cb) => {
        const userId = req.user.id
        const id = req.params.id
        const check = await User.findByPk(userId)
        if(!check) return cb(new Error('There is no this plan.'))
        await check.update({
            planId: id
        })
        const user = await User.findByPk(userId,{
            include: [{
                model: Plan,
            }]
        })
        const result = {
            ...toPackage('success'),
            user: user.toJSON()
        }
        return cb(null, result)
    },
    singlePlanPage: async (req, cb) => {
        const id = req.params.id
        const plan = await Plan.findByPk(id, {
            include: [{
              model: Quiz,
              as: 'PlanCollectToQuiz',
            }],
        })
        if (!plan) return cb(new Error('There is no this plan existed.'))
        let deal =  plan.toJSON()
        if (!deal.PlanCollectToQuiz.length) return cb(new Error('There is no quiz in this plan.'))
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
    },
    singlePlanDeleteQuiz: async (req, cb) => {
        const quizId = req.params.id
        const planId = req.body.planId
        const find = await Collection.findOne({
            where:{
                quizId,
                planId
            }
        })
        if(!find) return cb(new Error('There is no this quiz in the plan'))
        find.destroy()
        let result = {
            ...toPackage('success'),
            quiz: find,
            planId
        }
        return cb(null, result)
    },
    quizAddToPlan: async (req, cb) => {
        const quizId = req.params.id
        const planId = req.user.planId
        const userId = req.user.id
        const find = await Collection.findOne({
            where:{
                quizId,
                planId,
                userId
            }
        })
        if (find) return cb(new Error('Already collect it in the default folder.'))
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
    },
    test: async (req, cb) => {
        const planId = req.params.id

        let plan = await Plan.findByPk(planId, {
            include: [{
              model: Quiz,
              as: 'PlanCollectToQuiz',
              attributes:['id','question','select1','select2','select3','select4','answer']
            }],
        })
        
        if (!plan.PlanCollectToQuiz.length) return cb(new Error('There is no quiz in this plan.'))
        plan = plan.toJSON()
        plan.PlanCollectToQuiz[0]['first'] = true
        plan.PlanCollectToQuiz.map((e) => delete e.Collection)
        const result = {
            ...toPackage('success'),
            quiz : plan.PlanCollectToQuiz,
            plan: {
                id: plan.id
            }
        }
        return cb(null, result)
    },
    postTest: async (req, cb) => {
        // need to fix the redio button for radio class name are not the same
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
        if (!plan) return cb(new Error('There is no this plan.'))
        plan = plan.toJSON()
        let arr = []
        for (let i in data) {
            arr[Number(i.slice(0,1)) - 1] = i.slice(-7)
        }
        let check = plan.PlanCollectToQuiz
        let l = check.length
        let count = 0

        for (let i = 0; i < l; i++) {
            let realAnswer = check[i].answer
            let userAnswer = arr[i]
            if (realAnswer === userAnswer) {
                count++
            }
        }
        let score = count * 100 / l
        score = Number(score.toFixed(2))

        let result = await Score.create({
            score,
            planId,
            userId
        })
        result = {
            ...toPackage('success'),
            result
        }

        req.flash('success_msg',`Test Plan (${plan.name}) , Total score: ${score.toFixed(2)}`)
        return cb(null, result)
    },
    resultPage: async (req, cb) => {
        const userId = req.user.id
        let result = await Score.findAll({
            where:{
                userId
            },
            include: [{
                model: Plan,
                attributes: ['id','name']
            }],
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        }) 

        let score = {
            ...toPackage('success'),
            score: result
        }
        return cb(null, score)
    }
}

module.exports = quizService