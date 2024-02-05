const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')
const adminRoute = require('./adminRoute')
const allProductsRoute = require('./allProductsRoute')
const introduceRoute = require('./introduceRoute')
const newArrivalRoute = require('./newArrivalRoute')
const authenticationRoute = require('./authenticationRoute')
const isAdmin = require('../app/middleware/isAdmin')

function route(app) {
  app.use('/home', homeRoute)

  app.use('/authentication', authenticationRoute)
  
  app.use('/product', productRoute)

  app.use('/admin', adminRoute)

  app.use('/all-products', allProductsRoute)

  app.use('/introduce', introduceRoute)

  app.use('/new-arrival', newArrivalRoute)

}

module.exports = route
