'use strict'
const faker = require('faker')
const { User } = require('../models')
const arr = ['select1','select2','select3','select4']


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
    await queryInterface.bulkInsert('Quizzes',
      Array.from({ length: 100 }, () => ({
        question: faker.lorem.words(10),
        select1: faker.lorem.words(10),
        select2: faker.lorem.words(10),
        select3: faker.lorem.words(10),
        select4: faker.lorem.words(10),
        answer: arr[Math.floor(Math.random() * arr.length)],
        user_id: userId[Math.floor(Math.random() * userId.length)],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Quizzes', {})
  }
}
