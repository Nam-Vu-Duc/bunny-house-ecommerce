const express = require('express')
const router = express.Router()
const allCustomersController = require('../../app/controllers/admin/allCustomersController')

router.get('/', allCustomersController.allCustomers)
router.get('/:id', allCustomersController.customerInfo)
router.get('/customer/create', allCustomersController.createCustomer)
router.post('/customer/created', allCustomersController.customerCreated)

module.exports = router