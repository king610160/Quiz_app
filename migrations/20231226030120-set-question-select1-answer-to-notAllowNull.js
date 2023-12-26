'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Quizzes', 'question', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Question cannot be null.',
          },
          notEmpty: {
            msg: 'Question cannot be empty.',
          },
        },
    })
    await queryInterface.changeColumn('Quizzes', 'select1', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Question cannot be null.',
          },
          notEmpty: {
            msg: 'Question cannot be empty.',
          },
        },
    })
    await queryInterface.changeColumn('Quizzes', 'answer', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Question cannot be null.',
          },
          notEmpty: {
            msg: 'Question cannot be empty.',
          },
        },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Quizzes', 'question', {
        type: Sequelize.STRING,
        allowNull: true
    })
    await queryInterface.changeColumn('Quizzes', 'select1', {
        type: Sequelize.STRING,
        allowNull: true
    })
    await queryInterface.changeColumn('Quizzes', 'answer', {
        type: Sequelize.STRING,
        allowNull: true
    })
  }
}
