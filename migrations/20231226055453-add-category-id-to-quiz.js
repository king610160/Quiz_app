'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Quizzes', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('Quizzes', 'category_id')
  }
}
