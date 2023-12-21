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
    }
}

module.exports = adminService