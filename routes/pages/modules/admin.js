const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/pages/admin-controller')

router.get('/', adminController.home)
router.get('/user', adminController.getAllUsers)

module.exports = router