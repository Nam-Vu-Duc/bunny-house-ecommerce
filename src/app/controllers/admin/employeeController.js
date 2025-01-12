const employee = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const bcrypt = require('bcryptjs')

class allEmployeesController {
  async allEmployees(req, res, next) {
    const index  = 'employees'
    const successful = req.flash('successful')

    const employees = await employee.find({}).lean()
    const totalEmployee = employees.length

    res.render('admin/all/employee', { title: 'Danh sách nhân sự', layout: 'admin', index, successful,  employees, totalEmployee })
  }

  async employeeInfo(req, res, next) {
    const index = 'employees'
    const employeeInfo = await employee.findOne({ _id: req.params.id }).lean()

    res.render('admin/detail/employee', { title: employeeInfo.userInfo.name, layout: 'admin', index, employeeInfo })
  }

  async employeeUpdate(req, res, next) {
    
  }

  async employeeCreate(req, res, next) {
    const index = 'employees'
    const stores = await store.find().lean()
    
    res.render('admin/create/employee', { title: 'Thêm nhân viên mới', layout: 'admin', index, stores })
  }

  async employeeCreated(req, res, next) {
    const empExist = await employee.findOne({ 'loginInfo.email': req.body.email })
    if (empExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/admin/all-employees/employee/create')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newEmp = new employee({
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
      },
      userInfo: {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        storeId: req.body.storeId
      }
    })
    await newEmp.save()

    req.flash('successful', 'create successful')
    res.redirect('/admin/all-employees')
  }
}
module.exports = new allEmployeesController