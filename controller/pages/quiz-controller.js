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
            res.render('quiz/quiz', data)
        })
    },
    // create quiz page
    createQuizPage: (req, res) => {
        res.render('quiz/createQuiz')
    },
    aiCreateQuiz: (req, res, next) => {
        quizService.aiCreateQuiz(req, (err, data) => {
            if (err) {
                next(err)
                return
            }
            res.render('quiz/createQuiz', data)
        })
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
            res.redirect('back')
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
    deletePlan: (req, res, next) => {
        quizService.deletePlan(req, (err) => {
            if (err) return next(err)
            res.redirect('back')
        })
    },
    // will change the default folder for saving quiz
    changeDefaultFolder: (req, res, next) => {
        quizService.changeDefaultFolder(req, (err, data) => {
            if (err) return next(err)
            req.flash('success_msg',`Your default folder had changed to ${data.user.Plan.name}`)
            res.redirect('back')
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
            if(err) return next(err)
            if (!data.quizLength) {
                req.flash('warning_msg','There is no quiz in the plan now.')
                return res.redirect('/plan')
            }
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
    // all the test result
    resultPage: (req, res, next) => {
        quizService.resultPage(req, (err, data) => {
            if(err) next(err)
            res.render('quiz/result/result', data)
        })
    },
    // delete test result (collection)
    deleteResult: (req, res, next) => {
        quizService.deleteResult(req, (err) => {
            if (err) return next(err)
            res.redirect('back')
        })
    },
    resultSinglePage: (req, res, next) => {
        quizService.resultSinglePage(req, (err, data) => {
            if(err) next(err)
            res.render('quiz/result/singleResult', data)
        })
    },
    // change user info
    userInfoPage: (req, res, next) => {
        quizService.userInfoPage(req, (err) => {
            if(err) return next(err)
            res.render('users/info')
        })
    },
    // edit page
    userEditPage: (req, res, next) => {
        quizService.userEditPage(req, (err, data) => {
            if(err) return next(err)
            res.render('users/info', data)
        })
    },
    // edit user's info, upload the user's photo to imgur
    putUserInfo: (req, res, next) => {
        quizService.putUserInfo(req, (err) => {
            if(err) return next(err)
            res.redirect('/user/info')
        })
    }
}

module.exports = quizController