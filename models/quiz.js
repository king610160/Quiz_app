'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.belongsTo(models.User, {foreignKey: 'userId'})
      Quiz.belongsTo(models.Category, {foreignKey: 'categoryId'})
      Quiz.belongsToMany(models.Plan, {
        through: models.Collection, // through collection to make contact
        foreignKey: 'quizId', // set foreign key
        as: 'PlanCollectToQuiz' // name this relation
      })
    }
  }
  Quiz.init({
    question: DataTypes.STRING,
    select1: DataTypes.STRING,
    select2: DataTypes.STRING,
    select3: DataTypes.STRING,
    select4: DataTypes.STRING,
    answer: DataTypes.NUMBER,
    isDelete: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'Quizzes',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['Collection'] }
    }
  })
  return Quiz
}