const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/pages/quiz-controller')

//
router.get('/test/setting')
router.get('/test')

// quiz page's CURD
router.get('/create', quizController.createQuizPage)
router.get('/:id', quizController.editQuizPage)
router.delete('/:id', quizController.deleteQuiz)
router.put('/:id', quizController.editQuiz)
router.post('/', quizController.postQuiz)
router.get('/', quizController.home)

router.use('/', (req, res) => res.redirect('/quiz'))

module.exports = router