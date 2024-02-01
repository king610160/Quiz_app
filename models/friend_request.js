'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Friend_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Friend_request.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    // use status to check request is waiting(0), reject(1) or accept(2)
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Friend_request',
    tableName:'Friend_requests',
    underscored: true,
  })
  return Friend_request
}