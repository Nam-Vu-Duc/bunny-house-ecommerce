const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const purchaseController = require('../../app/controllers/admin/purchaseController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/'                    , purchaseController.allPurchases)

router.get('/purchase/create'     , purchaseController.purchaseCreate)
router.post('/purchase/created'   , purchaseController.purchaseCreated)

router.get('/purchase/:id'        , purchaseController.purchaseInfo)
router.put('/purchase/updated/:id', purchaseController.purchaseUpdate)

router.post('/data/purchases'     , purchaseController.getPurchases)
router.post('/data/purchase'      , purchaseController.getPurchase)
router.post('/data/filter'        , purchaseController.getFilter)

module.exports = router