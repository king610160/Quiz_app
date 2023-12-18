const express = require('express')
const router = express.Router()

const userController = require('../../../controller/apis/user-controller')

router.post('/register', userController.register)

module.exports = router