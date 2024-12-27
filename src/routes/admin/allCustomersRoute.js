const express = require('express')
const router = express.Router()
const allCustomersController = require('../../app/controllers/admin/allCustomersController')

router.get('/', allCustomersController.allCustomers)

router.get('/customer/create', allCustomersController.createCustomer)
router.post('/customer/created', allCustomersController.customerCreated)

router.get('/customer/:id', allCustomersController.customerInfo)
router.put('/customer/updated/:id', allCustomersController.customerUpdate)

module.exports = router