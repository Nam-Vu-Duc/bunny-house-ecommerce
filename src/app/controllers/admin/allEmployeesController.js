const employee = require('../../models/employeeModel')

class allEmployeesController {
  async allEmployees(req, res, next) {
    const employees = await employee.find({}).lean()
    const index  = 'employees'
    const totalEmployees = employees.length

    res.render('admin/allEmployees', { title: 'Danh sách nhân sự', layout: 'admin', employees, totalEmployees, index })
  }

  async employeeInfo(req, res, next) {
    const index = 'employees'
    const employeeInfo = await employee.findOne({ _id: req.params.id }).lean()

    res.render('admin/employee', { title: employeeInfo.userInfo.name, layout: 'admin', employeeInfo, index })
  }
}
module.exports = new allEmployeesController