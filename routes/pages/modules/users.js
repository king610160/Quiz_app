const express = require('express')
const router = express.Router()

const userController = require('../../../controller/pages/user-controller')

router.get('/login', userController.login)

module.exports = router