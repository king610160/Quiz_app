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
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Score',
    tableName: 'Scores',
    underscored: true,
  })
  return Score
}