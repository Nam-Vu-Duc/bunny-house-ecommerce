const homeRoute = require('./homeRoute')
const productRoute = require('./productRoute')
const adminRoute = require('./adminRoute')
const allProductsRoute = require('./allProductsRoute')
const introduceRoute = require('./introduceRoute')
const authenticationRoute = require('./authenticationRoute')
const allOrdersRoute = require('./allOrdersRoute')
const orderRoute = require('./orderRoute')
const profileRoute = require('./profileRoute')
const checkAdmin = require('../app/middleware/checkAdmin')
const cookieParser = require('cookie-parser')

function route(app) {
  app.use(cookieParser())

  app.use('/home', homeRoute)

  app.use('/authentication', authenticationRoute)
  
  app.use('/admin', checkAdmin, adminRoute)
  
  app.use('/all-products', allProductsRoute)
  
  app.use('/product', productRoute)

  app.use('/all-orders', allOrdersRoute)
  
  app.use('/order', orderRoute)
 
  app.use('/introduce', introduceRoute)
  
  app.use('/profile', profileRoute)
  
}
module.exports = route
