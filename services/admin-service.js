const { User, Quiz, Category } = require('../models')

const adminService = {
    getAllUsers: async (req, cb) => {
        const users = await User.findAll({
            raw: true,
            nest: true
        })
        const setting = {
            user: true
        }
        const data = {
            users,
            setting
        }
        return cb(null, data)
    },
    deleteUser: async (req, cb) => {
        const id = req.params.id
        const user = await User.findByPk(id)
        if (!user) return cb(new Error('This user is not existed'))
        await user.destroy()
        return cb(null, user)
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
        const setting = {
            quiz: true
        }
        const data = {
            quiz,
            setting
        }
        return cb(null, data)
    },
    getAllCategory: async (req, cb) => {
        const category = await Category.findAll({
            raw:true,
            nest:true,
        })
        const setting = {
            category: true
        }
        const data = {
            category,
            setting
        }
        return cb(null, data)
    },
    postCategory: async (req, cb) => {
        try {
            const { name } = req.body
            if (!name) throw new Error('Please enter the category.')
            const result = await Category.create({
                name
            })
            return cb(null, result)
        } catch(err) {
            return cb(err)
        }
    },
    editCategoryPage: async (req, cb) => {
        try {
            const id = req.params.id
            if (!id) throw new Error('There is no this category.')
            let result = await Category.findByPk(id)
            if (!result) throw new Error('There is no this category in database')
            let category = await Category.findAll({
                raw:true,
                nest:true,
            })
            const setting = {
                category: true
            }
            const data = {
                edit: true,
                setting,
                result: result.toJSON(),
                category
            }
            return cb(null, data)
        } catch(err) {
            return cb(err)
        }
    },
    editCategory: async (req, cb) => {
        try {
            const { name } = req.body
            const id = req.params.id
            if (!name) throw new Error('Please enter the category.')
            const update = await Category.findByPk(id)
            if (!update) throw new Error('There is no this id data in database')
            await update.update({ name })
            return cb(null)
        } catch(err) {
            return cb(err)
        }
    },
    deleteCategory: async (req, cb) => {
        try {
            const id = req.params.id
            if (!id) throw new Error('There is no this category.')
            const result = await Category.findByPk(id)
            await result.destroy()
            return cb(null, result)
        } catch(err) {
            return cb(err)
        }
    },
}

module.exports = adminService