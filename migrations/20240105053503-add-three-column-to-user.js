'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Scores', 'all_quiz_answer', {
          type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Scores', 'all_user_answer', {
          type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Scores', 'all_quiz_id', {
          type: Sequelize.STRING,
      })
    ]) 
    
  },

  async down (queryInterface) {
    await Promise.all([
      queryInterface.removeColumn('Scores', 'all_quiz_answer'),
      queryInterface.removeColumn('Scores', 'all_user_answer'),
      queryInterface.removeColumn('Scores', 'all_quiz_id')
    ])
  }
}
