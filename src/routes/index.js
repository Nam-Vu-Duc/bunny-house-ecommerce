const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')
const adminRoute = require('./adminRoute')
const allProducts = require('./allProductsRoute')

function route(app) {
  app.use('/home', homeRoute)

  app.use('/product', productRoute)

  app.use('/admin', adminRoute)

  app.use('/all-products', allProducts)

}

module.exports = route
