const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/pages/quiz-controller')

// test : select what plan want to test
router.get('/test/select', quizController.testSelect)
// router.get('/test')

// plan, make plan
router.get('/plan', quizController.planHome)

// quiz page's CURD, make quiz
router.get('/create', quizController.createQuizPage)
router.get('/:id', quizController.editQuizPage)
router.delete('/:id', quizController.deleteQuiz)
router.put('/:id', quizController.editQuiz)
router.post('/', quizController.postQuiz)
router.get('/', quizController.home)

router.use('/', (req, res) => res.redirect('/quiz'))

module.exports = router