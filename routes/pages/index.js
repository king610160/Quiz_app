const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')

const { authenticated } = require('../../middleware/auth')

// big bracket means to load function
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/quiz', authenticated,  quiz)
router.use('/users', users)

router.use('/', (req, res) => res.redirect('/users/login'))
router.use('/', generalErrorHandler)  // use function

module.exports = router