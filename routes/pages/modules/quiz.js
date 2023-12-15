const express = require('express')
const router = express.Router()

const quizController = require('../../../controller/pages/quiz-controller')

router.get('/', quizController.home)

module.exports = router