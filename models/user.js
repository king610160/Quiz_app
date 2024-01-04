'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Quiz, { foreignKey: 'userId' })
      User.belongsTo(models.Plan, { foreignKey: 'planId' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    planId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  })
  return User
}