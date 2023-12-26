const { Quiz } = require('../models')

const quizService = {
    // home may put personnel info
    home: async(req, cb) => {
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
    // testSettingPage: async (req, cb) => {
        
    // }
}

module.exports = quizService