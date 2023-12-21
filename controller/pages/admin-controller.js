const { User } = require('../../models')

const adminController = {
    home: (req, res) => {
        res.render('admin/home')
    },
    getAllUsers: async (req, res) => {
        const users = await User.findAll({
            raw: true,
            nest: true
        })
        const setting = {
            user: true
        }
        // console.log(users)
        res.render('admin/allUser', {users, setting})
        // res.redirect('/admin')
    }
}

module.exports = adminController