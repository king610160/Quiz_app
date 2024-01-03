// const { Quiz } = require('../../models')
const quizService = require('../../services/quiz-service')

const quizController = {
    // home may put personnel info
    home: (req, res, next) => {
        quizService.home(req, (err, data) => {
            if(err) return next(err)
            res.render('quiz/homePage', data)
        })  
    },
    // go to quiz page for checking the quiz
    quizPage: (req, res, next) => {
        quizService.quizPage(req, (err, data) => {
            if (err) next(err)
            res.render('quiz/quiz', {quiz: data})
        })
    },
    // create quiz page
    createQuizPage: (req, res) => {
        res.render('quiz/createQuiz')
    },
    // post the info in the create quiz page
    postQuiz: (req, res, next) => {
        quizService.postQuiz(req, (err) =>{
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been created successfully.')
            res.redirect('/quiz')
        })
    },
    // edit quiz page
    editQuizPage: (req, res, next) => {
        quizService.editQuizPage(req, (err, data) => {
            if (err) return next(err)
            res.render('quiz/editQuiz', data)
        })

    },
    // put the info in the edit quiz page
    editQuiz: (req, res, next) => {
        quizService.editQuiz(req, (err) => {
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been updated successfully.')
            res.redirect('/quiz')
        })

    },
    // delete quiz
    deleteQuiz: (req, res, next) => {
        quizService.deleteQuiz (req, (err) => {
            if (err) return next(err)
            req.flash('success_msg', 'The quiz had been deleted successfully.')
            res.redirect('/quiz')
        })
    },
    // go to test page for test
    test: (req, res, next) => {
        quizService.test(req, (err, data) => {
            if(err) return next(err)
            res.render('quiz/test/test', data)
        })
    },
    // post test result
    postTest: (req, res, next) => {
        quizService.postTest(req, (err) => {
            if(err) return next(err)
            res.redirect('/home')
        })
        
    },
    // go to plan page
    planPage: (req, res, next) => {
        quizService.planPage(req, (err, data) => {
            if(err) return next(err)
            res.render('quiz/plan/planPage', data)
        })
    },
    // post new plan, only the name of folder
    postPlan: (req, res, next) => {
        quizService.postPlan(req, (err) => {
            if (err) return next(err)
            res.redirect('/plan')
        })
    },
    // will change the default folder for saving quiz
    changeDefaultFolder: (req, res, next) => {
        quizService.changeDefaultFolder(req, (err, data) => {
            if (err) return next(err)
            req.flash('success_msg',`Your default folder had changed to ${data.plan.name}`)
            res.redirect('/plan')
        })
    },
    // go to single plan page, many quiz in the plan
    singlePlanPage: (req, res, next) => {
        quizService.singlePlanPage(req, (err, data) => {
            if(err) return next(err)
            res.render('quiz/plan/singlePlan', data)
        })
    },
    // delete this plan's quiz
    singlePlanDeleteQuiz: (req, res, next) => {
        quizService.singlePlanDeleteQuiz(req, (err, data) => {
            if(err) return  next(err)
            res.redirect(`/plan/${data.planId}`)
        })
    },
    // add the quiz to plan
    quizAddToPlan: (req, res, next) => {
        quizService.quizAddToPlan(req, (err) => {
            if(err) return next(err)
            res.redirect('back')
        })
    },
    resultPage: (req, res, next) => {
        quizService.resultPage(req, (err, data) => {
            if(err) next(err)
            res.render('quiz/result/result', data)
        })
    }
}

module.exports = quizController