const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')

const userController = require('../../../controller/apis/user-controller')

router.post('/register', userController.register)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)

module.exports = router