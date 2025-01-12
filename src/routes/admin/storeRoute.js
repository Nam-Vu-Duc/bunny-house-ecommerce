const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const storeController = require('../../app/controllers/admin/storeController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/', storeController.allStores)

router.get('/store/create', storeController.storeCreate)
router.post('/store/created', storeController.storeCreated)

router.get('/store/:id', storeController.storeInfo)
router.put('/store/updated/:id', storeController.storeUpdate)

module.exports = router