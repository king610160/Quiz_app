const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')
const admin = require('./modules/admin')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

// big bracket means to load function
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.use('/users', users)
router.use('/', authenticated, quiz)

router.use('/', (req, res) => res.redirect('/users/login'))
router.use('/', generalErrorHandler)  // use function

module.exports = router