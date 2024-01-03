const adminService = require('../../services/admin-service')

const adminController = {
    getAllUsers: (req, res, next) => {
        adminService.getAllUsers(req, (err, data) => {
            if (err) return next(err)
            delete data.setting
            res.json({
                data
            })
        })
    },
    deleteUser: (req, res, next) => {
        adminService.deleteUser(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    getAllQuiz: (req, res, next) => {
        adminService.getAllQuiz(req, (err, data) => {
            if(err) return next(err)
            delete data.setting
            res.json({
                data
            })
        })
    },
    getAllCategory: (req, res ,next) => {
        adminService.getAllCategory(req, (err, data) => {
            if (err) return next(err)
            delete data.setting
            res.json({
                data
            })
        })
    },
    postCategory: (req, res, next) => {
        adminService.postCategory(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    editCategoryPage: (req, res, next) => {
        adminService.editCategoryPage(req, (err, data) => {
            if (err) return next(err)
            delete data.setting
            delete data.edit
            res.json({
                data
            })
        })
    },
    editCategory: (req, res, next) => {
        adminService.editCategory(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    },
    deleteCategory: (req, res, next) => {
        adminService.deleteCategory(req, (err, data) => {
            if (err) return next(err)
            res.json({
                data
            })
        })
    }
}

module.exports = adminController