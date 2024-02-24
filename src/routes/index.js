const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')
const adminRoute = require('./adminRoute')
const allProductsRoute = require('./allProductsRoute')
const introduceRoute = require('./introduceRoute')
const authenticationRoute = require('./authenticationRoute')
const ordersRoute = require('./ordersRoute')
const checkAdmin = require('../app/middleware/checkAdmin')
const cookieParser = require('cookie-parser')

function route(app) {
  app.use(cookieParser())

  app.use('/home', homeRoute)

  app.use('/authentication', authenticationRoute)
  
  app.use('/product', productRoute)

  app.use('/admin', checkAdmin, adminRoute)

  app.use('/all-products', allProductsRoute)

  app.use('/introduce', introduceRoute)

  app.use('/orders', ordersRoute)
}

module.exports = route
