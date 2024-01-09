'use strict'
const faker = require('faker')
const { User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // last 6 people's id as demo tester
    const users = await User.findAll({
      attributes: ['id'],
      order: [['id', 'DESC']],
      limit: 6,
      raw: true,
      nest: true
  })

  const userId = users.map(user => user.id)
    await queryInterface.bulkInsert('Plans',
      Array.from({ length: 25 }, () => ({
        name: faker.lorem.words(5),
        user_id: userId[Math.floor(Math.random() * userId.length)],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Plans', {})
  }
}
