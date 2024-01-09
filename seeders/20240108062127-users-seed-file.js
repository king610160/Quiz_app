'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/lWfnwaG.jpeg'
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/kPLLkDv.jpeg'
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/U8FYM4m.jpeg'
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: false,
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/U8FYM4m.jpeg'
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: false,
      name: 'user4',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/U8FYM4m.jpeg'
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('1234', 10),
      is_admin: false,
      name: 'user5',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/U8FYM4m.jpeg'
    }], {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Users', {})
  }
}
