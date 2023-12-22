const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/pages/admin-controller')

router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getAllUsers)
router.get('/', adminController.home)

router.use('/', (req, res) => res.redirect('/quiz'))

module.exports = router