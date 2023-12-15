require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT
const exphbs = require('express-handlebars')
const { pages } = require('./routes')


// view's related
app.engine('hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// set static file
app.use(express.static('public'))

app.use(pages)

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`)
})