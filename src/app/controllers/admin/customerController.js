require('dotenv').config()
const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const aiChat = require('../../models/aiChatModel')
const order = require('../../models/orderModel')
const member = require('../../models/memberModel')
const bcrypt = require('bcryptjs')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class allCustomersController {
  // all
  async getCustomers(req, res, next) {
    try {
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
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async getFilter(req, res, next) {
    try {
      const memberShip = await member.find().lean()
      return res.json({memberShip: memberShip})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async allCustomers(req, res, next) {
    return res.render('admin/all/customer', { title: 'Danh sách khách hàng', layout: 'admin' })
  }

  // update
  async getCustomer(req, res, next) {
    try {
      const customerInfo = await user.findOne({ _id: req.body.id }).lean()
      if (!customerInfo) throw new Error('error')

      const [memberInfo, orderInfo] = await Promise.all([
        member.findOne({ code: customerInfo.memberCode}).lean(),
        order.aggregate([
          {
            $match: { 'customerInfo.userId': req.body.id }
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
      
      return res.json({customerInfo: customerInfo, memberInfo: memberInfo, orderInfo: orderInfo})

    } catch (error) {
      return res.json({error: error})
    }
  }

  async customerInfo(req, res, next) {
    try {
      if (!checkForHexRegExp(req.params.id)) throw new Error('error')
      if (!(await user.findOne({ _id: req.params.id }).lean())) throw new Error('error')

      return res.render('admin/detail/customer', { layout: 'admin' })

    } catch (error) {
      return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' }) 
    }
  }

  async customerUpdate(req, res, next) {
    try {
      await user.updateOne({ _id: req.body.id }, {
        name   : req.body.name    ,
        phone  : req.body.phone   ,
        address: req.body.address ,
        gender : req.body.gender  ,
      })
  
      return res.json({isValid: true, message: 'Cập nhật thông tin thành công'})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  // create
  async createCustomer(req, res, next) {
    return res.render('admin/create/customer', { title: 'Thêm khách hàng mới', layout: 'admin' })
  }

  async customerCreated(req, res, next) {
    try {
      const userExist = await user.findOne({ email: req.body.email })
      if (userExist) return res.json({isValid: false, message: 'Email đã tồn tại'})

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
      return res.json({isValid: true, message: 'Tạo tài khoản thành công'})

    } catch (error) {
      return res.json({error: error})
    }
  }
}
module.exports = new allCustomersController