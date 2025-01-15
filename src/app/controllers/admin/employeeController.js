const employee = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const bcrypt = require('bcryptjs')

class allEmployeesController {
  async allEmployees(req, res, next) {
    const index  = 'employees'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [employees, totalEmployee] = await Promise.all([
      employee.find({}).skip(skip).limit(itemsPerPage).lean(),
      employee.find({}).countDocuments()
    ])

    res.render('admin/all/employee', { title: 'Danh sách nhân sự', layout: 'admin', index, successful, employees, totalEmployee, currentPage })
  }

  async employeeInfo(req, res, next) {
    const index = 'employees'
    const successful = req.flash('successful')

    const employeeInfo = await employee.findOne({ _id: req.params.id }).lean()
    const stores = await store.find().lean()

    res.render('admin/detail/employee', { title: employeeInfo.userInfo.name, layout: 'admin', index, successful, employeeInfo, stores })
  }

  async employeeUpdate(req, res, next) {
    const {
      role,
      name,
      email,
      phone,
      address,
      gender,
      store
    } = req.body

    await employee.updateOne({ _id: req.params.id }, {
      $set: {
        "loginInfo.email"   : email   ,
        "loginInfo.role"    : role    ,
        "userInfo.name"     : name    ,
        "userInfo.phone"    : phone   ,
        "userInfo.address"  : address ,
        "userInfo.gender"   : gender  ,
        "userInfo.storeId"  : store   ,
      }
    })

    req.flash('successful', 'Cập nhật nhân sự thành công')
    res.redirect(req.get('Referrer') || '/admin')
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

    req.flash('successful', 'Thêm nhân viên thành công')
    res.redirect('/admin/all-employees')
  }
}
module.exports = new allEmployeesController