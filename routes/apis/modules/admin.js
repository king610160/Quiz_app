const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/apis/admin-controller')

router.get('/users', adminController.getAllUsers)

module.exports = router