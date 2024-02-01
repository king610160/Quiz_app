const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')

const quizController = require('../../../controller/pages/quiz-controller')

// test : select what plan want to test
router.get('/test/:id', quizController.test)
router.post('/test/:id', quizController.postTest)

// result : check test result
router.get('/result/:id', quizController.resultSinglePage)
router.delete('/result/:id', quizController.deleteResult)
router.get('/result', quizController.resultPage)

// singlePlan
router.delete('/plan/quiz/:id', quizController.singlePlanDeleteQuiz)

// plan, make plan
router.post('/plan/defaultFolder/:id', quizController.changeDefaultFolder)
router.delete('/plan/:id', quizController.deletePlan)
router.get('/plan/:id', quizController.singlePlanPage)
router.get('/plan', quizController.planPage)
router.post('/plan', quizController.postPlan)

// homePage
router.get('/home', quizController.home)
router.post('/user/collect/:id', quizController.quizAddToPlan)

// self panel
router.get('/user/info/edit/:id', quizController.userEditPage)
router.put('/user/info/:id', upload.single('file'),quizController.putUserInfo)
router.get('/user/info/:id', quizController.userInfoPage)
router.post('/user/beFriend/:id', quizController.beFriend)

// quiz page's CURD, make quiz
router.get('/quiz/create', quizController.createQuizPage)
router.post('/quiz/ai', quizController.aiCreateQuiz)
router.get('/quiz/:id', quizController.editQuizPage)
router.delete('/quiz/:id', quizController.deleteQuiz)
router.put('/quiz/:id', quizController.editQuiz)
router.post('/quiz', quizController.postQuiz)
router.get('/quiz', quizController.quizPage)

router.use('/', (req, res) => res.redirect('/home'))

module.exports = router