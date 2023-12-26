const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/pages/admin-controller')

// admin's user manipulate
router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getAllUsers)

// admin's quiz manipulate
router.get('/quiz', adminController.getAllQuiz)

// admin's category manipulate
router.delete('/category/:id', adminController.deleteCategory)
router.put('/category/:id', adminController.editCategory)
router.get('/category/:id', adminController.editCategoryPage)
router.post('/category', adminController.postCategory)
router.get('/category', adminController.getAllCategory)

router.use('/', (req, res) => res.redirect('/admin/users'))

module.exports = router