const { User, Quiz, Category } = require('../models')
const { toPackage } = require('../helper/api-helper')
const { NoPermissionError, NotFoundError, BadRequestError } = require('../middleware/errors')

const adminService = {
    getAllUsers: async (req, cb) => {
        const users = await User.findAll({
            order: [['id', 'ASC']],
            raw: true,
            nest: true
        })
        const data = {
            ...toPackage('success','user'),
            users
        }
        return cb(null, data)
    },
    deleteUser: async (req, cb) => {
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
    },
    getAllQuiz: async (req, cb) => {
        const quiz = await Quiz.findAll({
            raw:true,
            nest:true,
        })
        quiz.forEach((e) => {
            let check = `${e.answer}true`
            e[check] = true
        })
        const data = {
            ...toPackage('success','quiz'),
            quiz
        }
        return cb(null, data)
    },
    getAllCategory: async (req, cb) => {
        const category = await Category.findAll({
            raw:true,
            nest:true,
        })
        const data = {
            ...toPackage('success','category'),
            category
        }
        return cb(null, data)
    },
    postCategory: async (req, cb) => {
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
    },
    editCategoryPage: async (req, cb) => {
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
    },
    editCategory: async (req, cb) => {
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
    },
    deleteCategory: async (req, cb) => {
        const id = req.params.id
        const deleteC = await Category.findByPk(id)
        if (!deleteC) return cb(new NotFoundError('There is no this category.'))
        await deleteC.destroy()
        const result = {
            ...toPackage('success',undefined),
            delete: deleteC
        }
        return cb(null, result)
    },
}

module.exports = adminService