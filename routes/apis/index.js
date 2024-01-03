const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const quiz = require('./modules/quiz')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')


router.use('/admin', authenticatedAdmin, admin)
router.use('/users', users)
router.use('/', authenticated, quiz)


// go to error-handle for api
router.use('/', apiErrorHandler)

module.exports = router