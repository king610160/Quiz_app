const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')

const { authenticated } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/users', users)
router.use('/quiz', authenticated, quiz)

// go to error-handle for api
router.use('/', apiErrorHandler)

module.exports = router