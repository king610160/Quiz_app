'use strict'

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')
const basename = path.basename(__filename)

const db = {}
let sequelize

// if process.env has DATABASE_URL, then use it as sequelize, else use config's parameter
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL)
} else {
  sequelize = new Sequelize({
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST, // 使用 Docker Compose 中定义的服务名称
      dialect: 'postgres',
      port: 5432
  })
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
