const employee = require('../../models/employeeModel')
const store = require('../../models/storeModel')

class allEmployeesController {
  async allEmployees(req, res, next) {
    const employees = await employee.find({}).lean()
    const index  = 'employees'
    const totalEmployees = employees.length

    res.render('admin/all/employee', { title: 'Danh sách nhân sự', layout: 'admin', employees, totalEmployees, index })
  }

  async employeeInfo(req, res, next) {
    const index = 'employees'
    const employeeInfo = await employee.findOne({ _id: req.params.id }).lean()

    res.render('admin/detail/employee', { title: employeeInfo.userInfo.name, layout: 'admin', employeeInfo, index })
  }

  async employeeUpdate(req, res, next) {
    
  }

  async employeeCreate(req, res, next) {
    const index = 'employees'
    const stores = await store.find().lean()
    res.render('admin/create/employee', { title: 'Thêm nhân viên mới', layout: 'admin', index, stores })
  }

  async employeeCreated(req, res, next) {
    const empExist = await emp.findOne({ 'loginInfo.email': req.body.email })
    if (empExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/authentication/sign-up')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newEmp = new emp({
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: 'employee'
      },
      userInfo: {
        name: req.body.name,
      }
    })
    const savedUser = await newEmp.save()

    res.redirect('/emp/authentication/sign-in')
  }
}
module.exports = new allEmployeesController