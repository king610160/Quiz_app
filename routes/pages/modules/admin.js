const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/pages/admin-controller')

router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getAllUsers)
router.get('/quiz', adminController.getAllUsers)
router.get('/category', adminController.getAllUsers)
router.get('/', adminController.home)

router.use('/', (req, res) => res.redirect('/admin/users'))

module.exports = router