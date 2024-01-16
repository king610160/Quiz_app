const { User, Quiz, Category } = require('../models')
const { toPackage } = require('../helper/api-helper')
const { NoPermissionError, NotFoundError, BadRequestError } = require('../middleware/errors')
const { getOffset, getPagination } = require('../helper/pagination-helper')

const adminService = {
    getAllUsers: async (req, cb) => {
        try {
            // user page's limit
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const users = await User.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: true,
                nest: true
            })
            const data = {
                ...toPackage('success','user'),
                users: users.rows,
                pagination: getPagination(limit, page, users.count),
                pgsetting: 'admin/users'
            }
            return cb(null, data)
        } catch(err) {
            return cb(err)
        }
    },
    deleteUser: async (req, cb) => {
        try {
            const id = req.params.id
            if (Number(id) === req.user.id) return cb(new NoPermissionError('You cannot delete yourselves'))
            let user = await User.findByPk(id)
            if (!user) return cb(new NotFoundError('This user is not existed'))
            let admin = user.toJSON()
            // eslint-disable-next-line
            if (admin.isAdmin) return cb(new NoPermissionError("You can't delete Admin's account."))
            await user.destroy()
            const result = {
                ...toPackage('success',undefined),
                user: user.toJSON()
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    getAllQuiz: async (req, cb) => {
        try {
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const quiz = await Quiz.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: true,
                nest: true
            })
            quiz.rows.forEach((e) => {
                let check = `${e.answer}true`
                e[check] = true
            })
            const data = {
                ...toPackage('success','quiz'),
                quiz: quiz.rows,
                pagination: getPagination(limit, page, quiz.count),
                pgsetting: 'admin/quiz'
            }
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
    },
    deleteQuiz: async (req, cb) => {
        try {
            let id = req.params.id
            const quiz = await Quiz.findByPk(id)
            if (!quiz) return cb(new NotFoundError('There is no that quiz existed.'))
            await quiz.destroy()
            const result = {
                ...toPackage('success'),
                quiz: quiz.toJSON()
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    getAllCategory: async (req, cb) => {
        try {
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const category = await Category.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: true,
                nest: true
            })
            const data = {
                ...toPackage('success','category'),
                category: category.rows,
                pagination: getPagination(limit, page, category.count),
                pgsetting: 'admin/category'
            }
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
    },
    postCategory: async (req, cb) => {
        try {
            const { name } = req.body
            if (!name) return cb(new BadRequestError('Please enter the category.'))
            const category = await Category.create({
                name
            })
            const result = {
                ...toPackage('sccuess', undefined),
                category
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    editCategoryPage: async (req, cb) => {
        try {
            const id = req.params.id
            let result = await Category.findByPk(id)
            if (!result) return cb(new NotFoundError('There is no this category in database'))
            let category = await Category.findAll({
                raw:true,
                nest:true,
            })
            const data = {
                ...toPackage('success','category'),
                edit: true,
                result: result.toJSON(),
                category
            }
            return cb(null, data)
        } catch (err) {
            return cb(err)
        }
    },
    editCategory: async (req, cb) => {
        try {
            const { name } = req.body
            const id = req.params.id
            if (!name) return cb(new BadRequestError('Please enter the category.'))
            let update = await Category.findByPk(id)
            if (!update) return cb(new NotFoundError('There is no this id data in database'))
            update = await update.update({ name })
            const result = {
                ...toPackage('success', undefined),
                update
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }
    },
    deleteCategory: async (req, cb) => {
        try {
            const id = req.params.id
            const deleteC = await Category.findByPk(id)
            if (!deleteC) return cb(new NotFoundError('There is no this category.'))
            await deleteC.destroy()
            const result = {
                ...toPackage('success',undefined),
                delete: deleteC
            }
            return cb(null, result)
        } catch (err) {
            return cb(err)
        }  
    },
}

module.exports = adminService