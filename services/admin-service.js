const { User, Quiz, Category } = require('../models')
const { toPackage } = require('../helper/api-helper')

const adminService = {
    getAllUsers: async (req, cb) => {
        const users = await User.findAll({
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
        let user = await User.findByPk(id)
        if (!user) return cb(new Error('This user is not existed'))
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
        if (!name) return cb(new Error('Please enter the category.'))
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
        if (!result) return cb(new Error('There is no this category in database'))
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
        if (!name) return cb(new Error('Please enter the category.'))
        let update = await Category.findByPk(id)
        if (!update) return cb(new Error('There is no this id data in database'))
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
        if (!deleteC) return cb(new Error('There is no this category.'))
        await deleteC.destroy()
        const result = {
            ...toPackage('success',undefined),
            delete: deleteC
        }
        return cb(null, result)
    },
}

module.exports = adminService