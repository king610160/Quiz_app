const adminService = require('../../services/admin-service')

const adminController = {
    // home: (req, res) => {
    //     res.render('admin/home')
    // },
    getAllUsers: (req, res, next) => {
        adminService.getAllUsers(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allUser', {users:data.users, setting:data.setting})
        })
    },
    deleteUser: (req, res, next) => {
        adminService.deleteUser(req, (err, data) => {
            if (err) next(err)
            req.flash('warning_msg',`You have delete ${data.name}'s account`)
            res.redirect('/admin/users')
        })
    },
    getAllQuiz: (req, res ,next) => {
        adminService.getAllQuiz(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allQuiz', data)
        })
    },
    getAllCategory: (req, res ,next) => {
        adminService.getAllCategory(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allCategory', data)
        })
    },
    postCategory: (req, res, next) => {
        adminService.postCategory(req, (err) => {
            if (err) next(err)
            res.redirect('/admin/category')
        })
    },
    editCategoryPage: (req, res, next) => {
        adminService.editCategoryPage(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allCategory', data)
        })
    },
    editCategory: (req, res, next) => {
        adminService.editCategory(req, (err) => {
            if (err) return next(err)
            res.redirect('/admin/category')
        })
    },
    deleteCategory: (req, res, next) => {
        adminService.deleteCategory(req, (err) => {
            if (err) next(err)
            res.redirect('/admin/category')
        })
    }
}

module.exports = adminController