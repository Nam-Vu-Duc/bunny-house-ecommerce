require('dotenv').config()
const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const aiChat = require('../../models/aiChatModel')
const order = require('../../models/orderModel')
const member = require('../../models/memberModel')
const bcrypt = require('bcryptjs')

class allCustomersController {
  async getCustomers(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      user
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
        user.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getCustomer(req, res, next) {
    
  }

  async getFilter(req, res, next) {
    const memberShip = await member.find().lean()
    res.json({data: memberShip})
  }

  async allCustomers(req, res, next) {
    const holderData = Array(10).fill({})

    res.render('admin/all/customer', { title: 'Danh sách khách hàng', layout: 'admin', holderData });
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

  async createCustomer(req, res, next) {
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
      email   : req.body.email,
      password: hashedPassword,
      role    : 'user',
      name    : req.body.name,
      phone   : req.body.phone,
      address : req.body.address
    })
    const savedUser = await newUser.save()

    const adminId = process.env.ADMIN_ID
    const newChat = new chat({
      adminId: adminId,
      userId: savedUser._id
    })
    const newAIChat = new aiChat({
      userId: savedUser._id
    })
    await newChat.save()
    await newAIChat.save()

    req.flash('successful', 'Thêm khách hàng thành công')
    res.redirect('/admin/all-customers')
  }
}
module.exports = new allCustomersController