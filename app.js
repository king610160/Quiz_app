require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
// const errorHandlerMiddleware = require('./middleware/error-handler')

const { pages, apis } = require('./routes')

// set static file
app.use(express.static('public'))

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// methodOverride
app.use(methodOverride('_method'))

// bodyParser
app.use(express.urlencoded({ extended: true }))

// flash-message
app.use(flash())

// set error-handle middleware
// app.use(errorHandlerMiddleware)

// session
app.use(session({
    secret: process.env.sessionSecret, 
    resave: false,  
    saveUninitialized: true 
}))

app.use('/apis/v1', apis)
app.use(pages)

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`)
})

// module.exports = sequelize