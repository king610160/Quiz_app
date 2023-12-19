const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')
// big bracket means to load function
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/quiz', quiz)
router.use('/users', users)

router.use('/', generalErrorHandler)  // use function

module.exports = router