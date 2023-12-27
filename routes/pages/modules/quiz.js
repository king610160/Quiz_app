const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/pages/quiz-controller')

// test : select what plan want to test
router.get('/test', quizController.testSelect)
// router.get('/test')

// plan, make plan
router.get('/plan', quizController.planHome)

// homePage
router.get('/home', quizController.homePage)

// quiz page's CURD, make quiz
router.get('/quiz/create', quizController.createQuizPage)
router.get('/quiz/:id', quizController.editQuizPage)
router.delete('/quiz/:id', quizController.deleteQuiz)
router.put('/quiz/:id', quizController.editQuiz)
router.post('/quiz', quizController.postQuiz)
router.get('/quiz', quizController.quizPage)

router.use('/', (req, res) => res.redirect('/quiz'))

module.exports = router