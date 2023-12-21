const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const quiz = require('./modules/quiz')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')


router.use('/admin', authenticatedAdmin, admin)
router.use('/quiz', authenticated, quiz)
router.use('/users', users)

// go to error-handle for api
router.use('/', apiErrorHandler)

module.exports = router