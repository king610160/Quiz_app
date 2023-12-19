const express = require('express')
const router = express.Router()

const userController = require('../../../controller/pages/user-controller')
const passport = require('../../../config/passport')

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect:'/users/login', failureFlash: true }) ,userController.login)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/logout', userController.logOut)

module.exports = router