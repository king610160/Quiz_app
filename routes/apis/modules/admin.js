const express = require('express')
const router = express.Router()

const adminController = require('../../../controller/apis/admin-controller')

// admin's user manipulate
router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getAllUsers)

// admin's quiz manipulate, will add thumb and disthumb, may can justify what quiz is bad
router.delete('/quiz/:id', adminController.deleteQuiz)
router.get('/quiz', adminController.getAllQuiz)

// admin's category manipulate
router.delete('/category/:id', adminController.deleteCategory)
router.put('/category/:id', adminController.editCategory)
router.get('/category/:id', adminController.editCategoryPage)
router.post('/category', adminController.postCategory)
router.get('/category', adminController.getAllCategory)

module.exports = router