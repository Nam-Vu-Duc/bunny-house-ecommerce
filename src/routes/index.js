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
const checkUser = require('../app/middleware/checkUser')
const cookieParser = require('cookie-parser')

function route(app) {
  app.use(cookieParser())

  app.use('/', checkUser, homeRoute)

  app.use('/home', checkUser, homeRoute)

  app.use('/authentication', authenticationRoute)
  
  app.use('/admin', checkAdmin, adminRoute)
  
  app.use('/all-products', checkUser, allProductsRoute)
  
  app.use('/product',checkUser, productRoute)

  app.use('/all-orders', checkUser, allOrdersRoute)
  
  app.use('/order', checkUser, orderRoute)
 
  app.use('/introduce', checkUser, introduceRoute)
  
  app.use('/profile', checkUser, profileRoute)
  
}
module.exports = route
