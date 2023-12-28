// const { Quiz } = require('../../models')
const quizService = require('../../services/quiz-service')

const quizController = {
    // home may put personnel info
    home: (req, res, next) => {
        quizService.home(req, (err, data) => {
            if(err) next(err)
            res.render('quiz/homePage', data)
        })
        
    },
    quizPage: (req, res, next) => {
        quizService.quiz(req, (err, data) => {
            if (err) next(err)
            res.render('quiz/quiz', {quiz: data})
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
    },
    testSelect: (req, res) => {
        res.render('quiz/test/testSelect')
    },
    planPage: (req, res, next) => {
        quizService.planPage(req, (err, data) => {
            if(err) return next(err)
            res.render('quiz/plan/planPage', data)
        })
    },
    postPlan: (req, res, next) => {
        quizService.postPlan(req, (err) => {
            if (err) return next(err)
            res.redirect('/plan')
        })
    },
    changeDefaultFolder: (req, res, next) => {
        quizService.changeDefaultFolder(req, (err, data) => {
            if (err) return next(err)
            res.local = data
            res.redirect('/plan')
        })
    },
    singlePlanPage: (req, res, next) => {
        quizService.singlePlanPage(req, (err) => {
            if(err) return next(err)
            res.render('quiz/plan/singlePlan')
        })
    }
}

module.exports = quizController