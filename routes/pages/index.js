const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const quiz = require('./modules/quiz')

router.use('/', quiz)
router.use('/users', users)

module.exports = router