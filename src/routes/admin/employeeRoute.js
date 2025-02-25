const express = require('express')
const router = express.Router()
const employeeController = require('../../app/controllers/admin/employeeController')

router.get('/'                    , employeeController.allEmployees)

router.get('/employee/create'     , employeeController.employeeCreate)
router.post('/employee/created'   , employeeController.employeeCreated)

router.get('/employee/:id'        , employeeController.employeeInfo)
router.put('/employee/updated/:id', employeeController.employeeUpdate)

router.post('/data/employees'     , employeeController.getEmployees)
router.post('/data/employee'      , employeeController.getEmployee)
router.post('/data/filter'        , employeeController.getFilter)

module.exports = router