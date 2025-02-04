const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const order = require('../../models/orderModel')
const member = require('../../models/memberModel')
const bcrypt = require('bcryptjs')

class allCustomersController {
  async allCustomers(req, res, next) {
    const index        = 'customers'
    const successful   = req.flash('successful')

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

    const [customers, totalCustomer, members] = await Promise.all([
      user
        .find(filterOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      user.find(filterOptions).countDocuments(),
      member.find({}).lean()
    ])

    res.render('admin/all/customer', { title: 'Danh sách khách hàng', layout: 'admin', index, successful, customers, totalCustomer, members, currentPage });
  }

  async customerInfo(req, res, next) {
    const index = 'customers'
    const successful = req.flash('successful')

    const customerInfo = await user.findOne({ _id: req.params.id }).lean()
    const [memberInfo, orderInfo] = await Promise.all([
      member.findOne({ code: customerInfo.memberCode}).lean(),
      order.aggregate([
        {
          $match: { 'customerInfo.userId': req.params.id }
        },
        {
          $lookup: {
            from: 'orderStatuses',
            localField: 'status',
            foreignField: 'code',
            as: 'orderStatus'
          }
        },
        {
          $unwind: '$orderStatus'
        }
      ])
    ])
    
    res.render('admin/detail/customer', { title: customerInfo.name, layout: 'admin', index, successful, customerInfo, memberInfo, orderInfo })
  }

  async customerUpdate(req, res, next) {
    const {
      name,
      email,
      phone,
      address,
      gender
    } = req.body

    await user.updateOne({ _id: req.params.id }, {
        email  : email   ,
        name   : name    ,
        phone  : phone   ,
        address: address ,
        gender : gender  ,
    })

    req.flash('successful', 'Cập nhật khách hàng thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }

  createCustomer(req, res, next) {
    const index = 'customers'
    const error = req.flash('error')
    
    res.render('admin/create/customer', { title: 'Thêm khách hàng mới', layout: 'admin', index, error })
  }

  async customerCreated(req, res, next) {
    const userExist = await user.findOne({ email: req.body.email })
    if (userExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/admin/all-customers/customer/create')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new user({
      email: req.body.email,
      password: hashedPassword,
      role: 'user',
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    })
    const savedUser = await newUser.save()

    const newChat = new chat({
      adminId: '65eddca37abb421b88771b3f',
      userId: savedUser._id
    })
    await newChat.save()
    req.flash('successful', 'Thêm khách hàng thành công')
    res.redirect('/admin/all-customers')
  }
}
module.exports = new allCustomersController