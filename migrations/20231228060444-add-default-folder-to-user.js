'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'default_folder', {
      type: Sequelize.INTEGER,
    })
  },

  async down (queryInterface) {
    await queryInterface.addColumn('Users', 'default_folder')
  }
}
