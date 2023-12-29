'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'plan_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Plans',
        key: 'id'
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('Users', 'plan_id')
  }
}
