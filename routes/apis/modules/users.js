const express = require('express')
const router = express.Router()

// will change later
const userController = require('../../../controller/pages/user-controller')


router.post('/login', userController.login)

router.post('/register', userController.register)

module.exports = router