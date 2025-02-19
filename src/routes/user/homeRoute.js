const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const router = express.Router()
const homeController = require('../../app/controllers/user/homeController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
router.use(flash())
router.get('/', homeController.show)
router.post('/data/products', homeController.getProducts)
router.post('/data/brands', homeController.getBrands)
router.get('/data/user', homeController.getUsers)
router.post('/data/search', homeController.searchInfo)

module.exports = router