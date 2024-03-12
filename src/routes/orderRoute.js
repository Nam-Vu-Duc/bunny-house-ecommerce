const express = require('express')
const router = express.Router()

const orderController = require('../app/controllers/orderController')

router.get('/:id', orderController.show)

module.exports = router