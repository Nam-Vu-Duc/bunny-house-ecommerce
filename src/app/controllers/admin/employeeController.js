const employee = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const position = require('../../models/positionModel')
const bcrypt = require('bcryptjs')

class allEmployeesController {
  async allEmployees(req, res, next) {
    const index        = 'employees'
    const successful   = req.flash('message')

    const currentPage  = req.query.page || 1
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= {}

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = queryList[key]
      }
    }

    const [employees, totalEmployee, positions, stores] = await Promise.all([
      employee
        .find(filterOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      employee.find(filterOptions).countDocuments(),
      position.find({}).lean(),
      store.find({}).lean()
    ])

    res.render('admin/all/employee', { title: 'Danh sách nhân sự', layout: 'admin', index, successful, employees, totalEmployee, positions, stores, currentPage })
  }

  async employeeInfo(req, res, next) {
    const index = 'employees'
    const successful = req.flash('successful')

    const [employeeInfo, stores, positions] = await Promise.all([
      employee.findOne({ _id: req.params.id }).lean(),
      store.find().lean(),
      position.find().lean()
    ])

    res.render('admin/detail/employee', { title: employeeInfo.name, layout: 'admin', index, successful, employeeInfo, positions, stores })
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
      email    : email   ,
      role     : role    ,
      name     : name    ,
      phone    : phone   ,
      address  : address ,
      gender   : gender  ,
      storeCode: store   ,
    })

    req.flash('successful', 'Cập nhật nhân sự thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }

  async employeeCreate(req, res, next) {
    const index = 'employees'
    const successful = req.flash('message')
    const stores = await store.find().lean()
    
    res.render('admin/create/employee', { title: 'Thêm nhân viên mới', layout: 'admin', index, stores, successful })
  }

  async employeeCreated(req, res, next) {
    const empExist = await employee.findOne({ email: req.body.email })
    if (empExist) {
      req.flash('message', 'Email đã tồn tại')
      return res.redirect('/admin/all-employees/employee/create')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newEmp = new employee({
      email     : req.body.email,
      password  : hashedPassword,
      role      : req.body.role,
      name      : req.body.name,
      phone     : req.body.phone,
      address   : req.body.address,
      storeCode : req.body.storeCode
    })
    await newEmp.save()

    req.flash('message', 'Thêm nhân viên thành công')
    res.redirect('/admin/all-employees')
  }
}
module.exports = new allEmployeesController