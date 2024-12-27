const express = require('express')
const router = express.Router()
const allEmployeesController = require('../../app/controllers/admin/allEmployeesController')

router.get('/', allEmployeesController.allEmployees)

router.get('/employee/create', allEmployeesController.employeeCreate)
router.post('/employee/created', allEmployeesController.employeeCreated)

router.get('/employee/:id', allEmployeesController.employeeInfo)
router.put('/employee/updated/:id', allEmployeesController.employeeUpdate)

module.exports = router