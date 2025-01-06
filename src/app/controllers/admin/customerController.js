const user = require('../../models/userModel')
const order = require('../../models/orderModel')

class allCustomersController {
  async allCustomers(req, res, next) {
    const index = 'customers'
    const customers = await user.find({ deletedAt: null, 'loginInfo.role': 'user' }).lean()
    const customerIds = customers.map(customer => customer._id.toString()) // Get all customer IDs

    // Find all orders for the retrieved customers
    const orders = await order.find({ 'customerInfo.userId': { $in: customerIds }, deletedAt: null }).lean()

    // Create a mapping of userId to orders
    const ordersByCustomer = {}
    orders.forEach(order => {
      const userId = order.customerInfo.userId
      if (!ordersByCustomer[userId]) { ordersByCustomer[userId] = [] }
      ordersByCustomer[userId].push(order);
    });

    // Attach the orders to each customer
    const customersWithOrders = customers.map(customer => {
      const customerOrders = ordersByCustomer[customer._id.toString()] || []
      const totalPrice = customerOrders.reduce((total, order) => total + order.totalOrderPrice, 0)
      return {
        ...customer,
        orders: customerOrders, // Attach orders or empty array if no orders found
        totalOrder: customerOrders.length,
        totalPrice: totalPrice
      };
    });

    const customerLength = customersWithOrders.length
    res.render('admin/all/customer', { title: 'Danh sách khách hàng', layout: 'admin', customersWithOrders, customerLength,index });
  }

  async customerInfo(req, res, next) {
    const index = 'customers'
    const customerInfo = await user.findOne({ _id: req.params.id }).lean()
    const orderInfo = await order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
    const totalOrder = orderInfo.length
    const totalPrice = orderInfo.reduce((total, order) => total + order.totalOrderPrice, 0)
    
    res.render('admin/detail/customer', { title: customerInfo.userInfo.name, layout: 'admin', customerInfo, orderInfo, totalOrder, totalPrice, index })
  }

  async customerUpdate(req, res, next) {
    
  }

  createCustomer(req, res, next) {
    const index = 'customers'
    res.render('admin/create/customer', { title: 'Thêm khách hàng mới', layout: 'admin', index })
  }

  async customerCreated(req, res, next) {
    let newCustomer = new user(req.body)

    await newCustomer.save()
      .then(() => res.redirect('/admin/all-customers'))
      .catch(next)
  }
}
module.exports = new allCustomersController