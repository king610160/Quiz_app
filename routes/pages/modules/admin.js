const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/pages/admin-controller')

router.get('/', adminController.home)
router.get('/users', adminController.getAllUsers)

module.exports = router