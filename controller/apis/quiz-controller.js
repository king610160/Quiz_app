const quizService = require('../../services/quiz-service')

const quizController = {
    home: (req, res, next) => {
        quizService.home(req, (err, data) => {
            if (err) next(err)
            res.json({
                status:'success',
                data: data
            })
        })
    },
    postQuiz: (req, res, next) => {
        quizService.postQuiz(req, (err, data) =>{
            if (err) next(err)
            res.json({
                status:'success',
                data
            })
        })
    },
    editQuizPage : (req, res, next) => {
        quizService.editQuizPage(req, (err, data) => {
            if(err) next(err)
            res.json({
                status: 'success',
                data
            })
        })
    },
    deleteQuiz: (req, res, next) => {
        quizService.deleteQuiz(req, (err, data) => {
            if(err) next(err)
            res.json({
                status: 'success',
                data
            })
        })
    }
}

module.exports = quizController