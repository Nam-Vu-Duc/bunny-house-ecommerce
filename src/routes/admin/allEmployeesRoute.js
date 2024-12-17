const express = require('express')
const router = express.Router()
const allEmployeesController = require('../../app/controllers/admin/allEmployeesController')

router.get('/', allEmployeesController.allEmployees)
router.get('/employee/:id', allEmployeesController.employeeInfo)

module.exports = router