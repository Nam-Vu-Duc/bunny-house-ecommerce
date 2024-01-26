const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')

function route(app) {
  app.use('/home', homeRoute)

  app.use('/products', productRoute)
}

module.exports = route
