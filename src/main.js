require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const app = express()
const route = require('./routes')
const db = require('./config/db')
const sortMiddleware = require('./app/middleware/sortMiddleware')
const Handlebars = require('handlebars')
const port = process.env.PORT

db.connect()

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
  extended: true
}))

app.use(express.json())

app.use(morgan('combined'))

app.use(methodOverride('_method'))

app.use(sortMiddleware)

app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'users',
  helpers: {
    addIndex: (a, b) => a + b,
  }
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource', 'views'))
app.set('view options', { layout: 'other' });

// upload image

//route 
route(app)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/home`)
})

