'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Quizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      select1: {
        type: Sequelize.STRING
      },
      select2: {
        type: Sequelize.STRING
      },
      select3: {
        type: Sequelize.STRING
      },
      select4: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.TINYINT
      },
      is_delete: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Quizzes')
  }
}