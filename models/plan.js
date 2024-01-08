'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      Plan.belongsToMany(models.Quiz, {
        through: models.Collection, // through collection to make contact
        foreignKey: 'planId', // set foreign key
        as: 'PlanCollectToQuiz' // name this relation
      }),
      Plan.hasMany(models.Score, {foreignKey: 'planId'})
    }
  }
  Plan.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Plan',
    tableName: 'Plans',
    underscored: true,
  })
  return Plan
}