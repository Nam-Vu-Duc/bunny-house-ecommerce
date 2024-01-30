const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')
const adminRoute = require('./adminRoute')
const allProductsRoute = require('./allProductsRoute')
const introduceRoute = require('./introduceRoute')
const newArrival = require('./newArrivalRoute')

function route(app) {
  app.use('/home', homeRoute)

  app.use('/product', productRoute)

  app.use('/admin', adminRoute)

  app.use('/all-products', allProductsRoute)

  app.use('/introduce', introduceRoute)

  app.use('/new-arrival', newArrival)

}

module.exports = route
