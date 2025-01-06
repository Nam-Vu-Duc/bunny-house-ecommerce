const express = require('express')
const router = express.Router()
const customerController = require('../../app/controllers/admin/customerController')

router.get('/', customerController.allCustomers)

router.get('/customer/create', customerController.createCustomer)
router.post('/customer/created', customerController.customerCreated)

router.get('/customer/:id', customerController.customerInfo)
router.put('/customer/updated/:id', customerController.customerUpdate)

module.exports = router