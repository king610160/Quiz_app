const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')
const admin = require('./modules/admin')
const auth = require('./modules/auth')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.use('/auth', auth)
router.use('/users', users)
router.use('/', authenticated, quiz)

router.use('/', (req, res) => res.redirect('/users/login'))
router.use('/', generalErrorHandler)  // use function

module.exports = router