const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/apis/quiz-controller')

router.get('/:id', quizController.editQuizPage)
router.delete('/:id', quizController.deleteQuiz)
// router.put('/:id', quizController.putQuiz)
router.post('/', quizController.postQuiz)
router.get('/', quizController.home)


router.get('/', quizController.home)

module.exports = router