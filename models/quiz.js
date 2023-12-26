'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quiz.belongsTo(models.User, {foreignKey: 'userId'})
      Quiz.belongsTo(models.Category, {foreignKey: 'categoryId'})
    }
  }
  Quiz.init({
    question: DataTypes.STRING,
    select1: DataTypes.STRING,
    select2: DataTypes.STRING,
    select3: DataTypes.STRING,
    select4: DataTypes.STRING,
    answer: DataTypes.NUMBER,
    isDelete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'Quizzes',
    underscored: true,
  })
  return Quiz
}