require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('./config/passport')
const session = require('express-session')
const { getUser } = require('./helper/auth-helper')

const { pages, apis } = require('./routes')

// set static file
app.use(express.static('public'))

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// return json
app.use(express.json())

// bodyParser
app.use(express.urlencoded({ extended : true }))

// methodOverride
app.use(methodOverride('_method'))

// flash-message
app.use(flash())

// session
app.use(session({
    secret: process.env.sessionSecret, 
    resave: false,  
    saveUninitialized: true 
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')  // set success_msg
    res.locals.warning_msg = req.flash('warning_msg')  // set warning_msg
    res.locals.error_msg = req.flash('error_msg') // set error_msg
    res.locals.user = getUser(req)
    next()
})

app.use('/apis/v1', apis)
app.use(pages)

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`)
})
