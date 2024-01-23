// dark-mode toggle
// function myFunction() {
//   var element = document.body;
//   element.classList.toggle("dark-mode");
// }
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.use(morgan('combined'))

app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource', 'views'))

app.get('/home', (req, res) => {
  res.render('home')
})

app.get('/products', (req, res) => {
  res.render('products')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
