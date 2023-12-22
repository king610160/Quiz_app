const { Quiz } = require('../models')

const quizService = {
    // home may put personnel info
    home: async(req, cb) => {
        const quiz = await Quiz.findAll({
            raw:true,
            nest:true,
        })
        return cb(null, quiz)
    },
    postQuiz: async (req, cb) => {
        let { question, select1, select2, select3, select4, answer } = req.body
        if (!question && !select1) throw new Error('Please fill question and at least an option.')
        if (answer === 'option0') throw new Error('Please select the answer')
        const quiz = await Quiz.create({
            question,
            select1,
            select2,
            select3,
            select4,
            answer: Number(answer)
        })
        return cb(null, quiz)
    },
    editQuizPage: async (req, cb) => {
        let id = req.params.id
        const quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
        return cb(null, quiz.toJSON())
    },
    deleteQuiz: async (req, cb) => {
        let id = req.params.id
        const quiz = await Quiz.findByPk(id)
        if (!quiz) throw new Error('There is no that quiz existed.')
        await quiz.destroy()
        return cb(null, quiz.toJSON())
    }
}

module.exports = quizService