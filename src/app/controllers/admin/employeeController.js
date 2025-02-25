const employee = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const position = require('../../models/positionModel')
const bcrypt = require('bcryptjs')

class allEmployeesController {
  // all
  async getEmployees(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      employee
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      employee.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getFilter(req, res, next) {
    const [positions, stores] = await Promise.all([
      position.find().lean(),
      store.find().lean()
    ])

    return res.json({position: positions, store: stores})
  }

  async allEmployees(req, res, next) {
    res.render('admin/all/employee', { title: 'Danh sách nhân sự', layout: 'admin' })
  }

  // update
  async getEmployee(req, res, next) {
    const [employeeInfo, storesInfo, positionsInfo] = await Promise.all([
      employee.findOne({ _id: req.body.id }).lean(),
      store.find().lean(),
      position.find().lean()
    ])
    if (!employeeInfo) return res.json({employeeInfo: null})

    return res.json({employeeInfo: employeeInfo, storesInfo: storesInfo, positionsInfo: positionsInfo})
  }

  async employeeInfo(req, res, next) {
    res.render('admin/detail/employee', { layout: 'admin' })
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
  }

  // create
  async employeeCreate(req, res, next) {
    const stores = await store.find().lean()
    
    res.render('admin/create/employee', { title: 'Thêm nhân viên mới', layout: 'admin', stores })
  }

  async employeeCreated(req, res, next) {
    const empExist = await employee.findOne({ email: req.body.email })
    if (empExist) return res.json({isValid: false, message: 'Email đã tồn tại'})

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
    return res.json({isValid: true, message: 'Tạo tài khoản thành công'})
  }
}
module.exports = new allEmployeesController