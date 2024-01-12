const quizService = require('../../services/quiz-service')

const quizController = {
    home: (req, res, next) => {
        quizService.home(req, (err, data) => {
            if (err) return next(err)
            if (data.setting) delete data.setting
            res.json({
                data
            })
        })
    },
    quizPage: (req, res, next) => {
        quizService.quizPage(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    aiCreateQuiz: (req, res, next) => {
        quizService.aiCreateQuiz(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    postQuiz: (req, res, next) => {
        quizService.postQuiz(req, (err, data) =>{
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    editQuizPage : (req, res, next) => {
        quizService.editQuizPage(req, (err, data) => {
            if(err) return next(err)
            res.json({
                data
            })
        })
    },
    editQuiz: (req, res, next) => {
        quizService.editQuiz(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })

    },
    deleteQuiz: (req, res, next) => {
        quizService.deleteQuiz(req, (err, data) => {
            if(err) next(err)
            res.json({
                data
            })
        })
    },
    test: (req, res, next) => {
        quizService.test(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    postTest: (req, res, next) => {
        quizService.postTest(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    planPage: (req, res, next) => {
        quizService.planPage(req, (err, data) => {
            if(err) return next(err)
            data.user = {
                planId: data.user.planId,
                Plan: data.user.Plan
            }
            res.json(data)
        })
    },
    postPlan: (req, res, next) => {
        quizService.postPlan(req, (err, data) => {
            if (err) return next(err)
            res.json(data)
        })
    },
    deletePlan: (req, res, next) => {
        quizService.deletePlan(req, (err, data) => {
            if (err) return next(err)
            res.json(data)
        })
    },
    changeDefaultFolder: (req, res, next) => {
        quizService.changeDefaultFolder(req, (err, data) => {
            if (err) return next(err)
            res.json(data)
        })
    },
    singlePlanPage: (req, res, next) => {
        quizService.singlePlanPage(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    singlePlanDeleteQuiz: (req, res, next) => {
        quizService.singlePlanDeleteQuiz(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    quizAddToPlan: (req, res, next) => {
        quizService.quizAddToPlan(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    resultPage: (req, res, next) => {
        quizService.resultPage(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    resultSinglePage: (req, res, next) => {
        quizService.resultSinglePage(req, (err, data) => {
            if(err) next(err)
            res.json(data)
        })
    },
    // change user info
    userInfoPage: (req, res, next) => {
        quizService.userInfoPage(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    // edit page
    userEditPage: (req, res, next) => {
        quizService.userEditPage(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    },
    // edit user's info, upload the user's photo to imgur
    putUserInfo: (req, res, next) => {
        quizService.putUserInfo(req, (err, data) => {
            if(err) return next(err)
            res.json(data)
        })
    }
}

module.exports = quizController