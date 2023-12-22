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

// extra security
// const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const { pages, apis } = require('./routes')


// deal with security fisrt
app.set('trust proxy', 1)
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
// app.use(helmet())
app.use(cors())
app.use(xss())



// set static file
app.use(express.static('public'))

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// bodyParser
app.use(express.urlencoded({ extended : true }))

// methodOverride
app.use(methodOverride('_method'))

// flash-message
app.use(flash())

// return json
app.use(express.json())

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

app.use('/api/v1', apis)
app.use(pages)

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`)
})
