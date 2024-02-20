require('dotenv').config()
require('express-async-errors')

const express = require('express')
const port = process.env.PORT || 3000
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helper/auth-helper')
const handlebarsHelper = require('./helper/handlebars-helper')
const path = require('path')
const session = require('./middleware/session')

// extra security
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const { pages, apis } = require('./routes')

const app = express()
  
// deal with security fisrt
app.set('trust proxy', 1)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
app.use(cors())
app.use(xss())
  
// set static file
app.use(express.static('public'))

// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs', helpers: handlebarsHelper}))
app.set('view engine', 'hbs')

// bodyParser
app.use(express.urlencoded({ extended : true }))

// methodOverride
app.use(methodOverride('_method'))

// morgan, use tiny to print the basic info
app.use(morgan('tiny'))
  
  
// local image storage
app.use('/upload', express.static(path.join(__dirname, 'upload'))) 

// return json
app.use(express.json())

// use redis to save session
app.use(session)

// flash-message
app.use(flash())

// let passport to examine the session correct or not
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

app.listen(port, (err) => {
  if (err) {
    console.error('Server start error:', err)
  } else {
    console.log(`Server is running on port ${port}`)
  }
})

module.exports = app