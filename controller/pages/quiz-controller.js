// const { Quiz } = require('../../models')
const quizService = require('../../services/quiz-service')

const quizController = {
    // home may put personnel info
    home: (req, res, next) => {
        quizService.home(req, (err, data) => {
            if (err) next(err)
            data.forEach((e) => {
                e.hook = `${e.id}select${e.answer}`
            })
            res.render('quiz/home', {quiz: data})
        })
    },
    createQuizPage: (req, res) => {
        res.render('quiz/createQuiz')
    },
    postQuiz: (req, res, next) => {
        quizService.postQuiz(req, (err) =>{
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been created successfully.')
            res.redirect('/quiz')
        })
    },
    editQuizPage: (req, res, next) => {
        quizService.editQuizPage(req, (err, data) => {
            if (err) return next(err)
            res.render('quiz/editQuiz', data)
        })

    },
    editQuiz: (req, res, next) => {
        quizService.editQuiz(req, (err) => {
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been updated successfully.')
            res.redirect('/quiz')
        })

    },
    deleteQuiz: (req, res, next) => {
        quizService.deleteQuiz (req, (err) => {
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been deleted successfully.')
            res.redirect('/quiz')
        })
    }
}

module.exports = quizController