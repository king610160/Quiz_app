'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {

    static associate(models) {
        Score.belongsTo(models.Plan, {foreignKey: 'planId'})
    }
  }
  Score.init({
    score: DataTypes.FLOAT,
    planId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    allQuizAnswer: DataTypes.STRING,
    allUserAnswer: DataTypes.STRING,
    allQuizId: DataTypes.STRING,
    correct: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Score',
    tableName: 'Scores',
    underscored: true,
  })
  return Score
}