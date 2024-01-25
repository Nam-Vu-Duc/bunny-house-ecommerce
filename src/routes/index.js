const homeRoute = require('./homeRoute')

function route(app) {
  app.use('/home', homeRoute)
  
  app.get('/products', (req, res) => {
    res.render('products')
  })
}

module.exports = route
