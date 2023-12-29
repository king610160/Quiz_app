const { User, Quiz, Plan, Collection } = require('../models')
const { Sequelize } = require('sequelize')
const { toPackage } = require('../helper/api-helper')

const quizService = {
    home: async(req, cb) => {
        // if no search value, then need to do something here.
        // if have search value
        const searchValue = req.query.search
        if(!searchValue) return cb(null)
        const quiz = await Quiz.findAll({
            where: {
                question: {
                    [Sequelize.Op.like]: `%${searchValue}%`
                }
            },
            raw: true,
            nest: true
        })

        quiz.forEach((e) => {
            e[`${e.answer}true`] = true
        })

        let data = toPackage('success', undefined)
        data = {
            ...data,
            quiz: quiz,
        }
        return cb(null, data)
    },
    quiz: async(req, cb) => {
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
        return cb(null, quiz)
    },
    postQuiz: async (req, cb) => {
        try {
            let { question, select1, select2, select3, select4, answer } = req.body
            if (!question || !select1) throw new Error('Please fill question and at least an option.')
            if (answer === '0') throw new Error('Please select the answer')
            const quiz = await Quiz.create({
                question,
                select1,
                select2,
                select3,
                select4,
                answer,
                userId: req.user.id
            })
            return cb(null, quiz)
        } catch (err) {
            return cb(err)
        }
    },
    editQuizPage: async (req, cb) => {
        let id = req.params.id
        let quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
        quiz = quiz.toJSON()
        let data = {
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
        return cb(null, update.toJSON)
    },
    deleteQuiz: async (req, cb) => {
        let id = req.params.id
        const quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
        await quiz.destroy()
        return cb(null, quiz.toJSON())
    },
    planPage: async (req, cb) => {
        const id = req.user.id
        const [plan, user] = await Promise.all([
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
        
        let result = {
            plan: plan,
            user: user.toJSON()
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
        return cb(null, plan.toJSON())
    },
    changeDefaultFolder: async (req, cb) => {
        const userId = req.user.id
        const id = req.params.id
        const user = await User.findByPk(userId)
        const update = await user.update({
            planId: id
        })
        const plan = await Plan.findByPk(id,{
            attributes: ['id','name']
        })
        const result = {
            update: update.toJSON(),
            plan: plan.toJSON()
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
        let deal =  plan.toJSON()
        for (let i of deal.PlanCollectToQuiz) {
            delete i.Collection
            const check = i.answer
            i[`${check}true`] = true
        }
        const result = {
            plan: deal
        }
        return cb(null, result)
    },
    quizAddToCollection: async (req, cb) => {
        const quizId = req.params.id
        const planId = req.user.planId
        console.log(req.user)
        const result = await Collection.create({
            quizId,
            planId
        })
        if(!result) throw new Error('Update fail')
        return cb(null)
    }
}

module.exports = quizService