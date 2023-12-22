const { User } = require('../models')

const adminService = {
    home: (req, res) => {
        res.render('admin/home')
    },
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
    }
}

module.exports = adminService