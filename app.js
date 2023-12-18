require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT
const exphbs = require('express-handlebars')

const { pages, apis } = require('./routes')

// bodyParser
app.use(express.urlencoded({ extended: true }))

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// set static file
app.use(express.static('public'))

app.use('/apis/v1', apis)
app.use(pages)

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`)
})

// module.exports = sequelize