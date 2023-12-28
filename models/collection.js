'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Collection.init({
    planId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Collection',
    tableName: 'Collections',
    underscored: true,
  })
  return Collection
}