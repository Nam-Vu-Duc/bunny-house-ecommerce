const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const order = require('../../models/orderModel')
const bcrypt = require('bcryptjs')

class allCustomersController {
  async allCustomers(req, res, next) {
    const index = 'customers'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage

    const [customers, totalCustomer] = await Promise.all([
      user.find({}).skip(skip).limit(itemsPerPage).lean(),
      user.find({}).countDocuments()
    ])
    const customerIds = customers.map(customer => customer._id.toString()) // Get all customer IDs
    const orders = await order.find({ 'customerInfo.userId': { $in: customerIds }, deletedAt: null }).lean()

    // Create a mapping of userId to orders
    const ordersByCustomer = {}
    orders.forEach(order => {
      const userId = order.customerInfo.userId
      if (!ordersByCustomer[userId]) { ordersByCustomer[userId] = [] }
      ordersByCustomer[userId].push(order)
    })

    // Attach the orders to each customer
    const customersWithOrders = customers.map(customer => {
      const customerOrders = ordersByCustomer[customer._id.toString()] || []
      const totalPrice = customerOrders.reduce((total, order) => total + order.totalOrderPrice, 0)
      return {
        ...customer,
        orders: customerOrders, // Attach orders or empty array if no orders found
        totalOrder: customerOrders.length,
        totalPrice: totalPrice
      }
    })

    res.render('admin/all/customer', { title: 'Danh sách khách hàng', layout: 'admin', index, customersWithOrders, totalCustomer, successful, currentPage });
  }

  async customerInfo(req, res, next) {
    const index = 'customers'
    const customerInfo = await user.findOne({ _id: req.params.id }).lean()
    const orderInfo = await order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
    const totalOrder = orderInfo.length
    const totalPrice = orderInfo.reduce((total, order) => total + order.totalOrderPrice, 0)
    
    res.render('admin/detail/customer', { title: customerInfo.userInfo.name, layout: 'admin', index, customerInfo, orderInfo, totalOrder, totalPrice })
  }

  async customerUpdate(req, res, next) {
    
  }

  createCustomer(req, res, next) {
    const index = 'customers'
    const error = req.flash('error')
    
    res.render('admin/create/customer', { title: 'Thêm khách hàng mới', layout: 'admin', index, error })
  }

  async customerCreated(req, res, next) {
    const userExist = await user.findOne({ 'loginInfo.email': req.body.email })
    if (userExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/admin/all-customers/customer/create')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new user({
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: 'user'
      },
      userInfo: {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
      }
    })
    const savedUser = await newUser.save()

    const newChat = new chat({
      adminId: '65eddca37abb421b88771b3f',
      userId: savedUser._id
    })
    await newChat.save()
    req.flash('successful', 'create successful')
    res.redirect('/admin/all-customers')
  }
}
module.exports = new allCustomersController