const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const port = 3000
const methodOverride = require('method-override')
const app = express()
const route = require('./routes')
const db = require('./config/db')
const sortMiddleware = require('./app/middleware/sortMiddleware')
const Handlebars = require('handlebars')
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
  helpers: {
    addIndex: (a, b) => a + b,
    sortable: (field, _sort) => {
      const sortType = field === _sort.column ? _sort.type : 'default'

      const icons = {
        default: 'fi fi-sr-sort',
        asc: 'fi fi-sr-sort-amount-down',
        desc: 'fi fi-sr-sort-amount-down-alt'
      }
      const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc'
      }

      const icon = icons[sortType]
      const type = types[sortType]

      const address = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`)
      const output = `<a href="${address}"><i class="${icon}"></i></a>`

      return new Handlebars.SafeString(output)
    }
  }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource', 'views'))

//route 
route(app)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/home`)
})
