const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/pages/quiz-controller')

// test : select what plan want to test
router.get('/test', quizController.testSelect)
// router.get('/test')

// plan, make plan
router.post('/plan/defaultFolder/:id', quizController.changeDefaultFolder)
router.get('/plan/:id', quizController.singlePlanPage)
router.get('/plan', quizController.planPage)
router.post('/plan', quizController.postPlan)

// homePage
router.get('/home', quizController.home)

// quiz page's CURD, make quiz
router.get('/quiz/create', quizController.createQuizPage)
router.get('/quiz/:id', quizController.editQuizPage)
router.delete('/quiz/:id', quizController.deleteQuiz)
router.put('/quiz/:id', quizController.editQuiz)
router.post('/quiz', quizController.postQuiz)
router.get('/quiz', quizController.quizPage)

router.use('/', (req, res) => res.redirect('/home'))

module.exports = router