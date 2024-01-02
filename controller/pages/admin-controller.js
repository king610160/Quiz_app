const adminService = require('../../services/admin-service')

const adminController = {
    // get all user info, homepage
    getAllUsers: (req, res, next) => {
        adminService.getAllUsers(req, (err, data) => {
            if (err) next(err)
            console.log(data)
            res.render('admin/allUser', {users: data.users, setting: data.setting})
        })
    },
    // delete user
    deleteUser: (req, res, next) => {
        adminService.deleteUser(req, (err, data) => {
            if (err) next(err)
            req.flash('warning_msg',`You have delete ${data.name}'s account`)
            res.redirect('/admin/users')
        })
    },
    // get all quiz
    getAllQuiz: (req, res ,next) => {
        adminService.getAllQuiz(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allQuiz', data)
        })
    },
    // get all category
    getAllCategory: (req, res ,next) => {
        adminService.getAllCategory(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allCategory', data)
        })
    },
    // create a new category
    postCategory: (req, res, next) => {
        adminService.postCategory(req, (err) => {
            if (err) next(err)
            res.redirect('/admin/category')
        })
    },
    // go to edit category page
    editCategoryPage: (req, res, next) => {
        adminService.editCategoryPage(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allCategory', data)
        })
    },
    // edit category and update to database
    editCategory: (req, res, next) => {
        adminService.editCategory(req, (err) => {
            if (err) return next(err)
            res.redirect('/admin/category')
        })
    },
    // delete the category
    deleteCategory: (req, res, next) => {
        adminService.deleteCategory(req, (err) => {
            if (err) next(err)
            res.redirect('/admin/category')
        })
    }
}

module.exports = adminController