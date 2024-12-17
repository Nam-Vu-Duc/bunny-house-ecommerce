const product = require('../../models/productModel')
const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const store = require('../../models/storeModel')
const brand = require('../../models/brandModel')
const employee = require('../../models/employeeModel')

class homeController {
  async show(req, res, next) {
    const index = 'home';
    const [orders, products, employees, customers, stores] = await Promise.all([
      order.find({ deletedAt: null }).sort({ totalOrderPrice: -1 }).lean(),
      product.find().lean(),
      employee.find().lean(),
      user.find({ deletedAt: null, 'loginInfo.role': 'user' }).lean(),
      store.find({}).lean()
    ]);

    const orderStats = orders.reduce(
      (acc, order) => {
        acc.orderLength++
        if (order.status === 'preparing') acc.preparingOrders++
        if (order.status === 'delivering') acc.deliveringOrders++
        if (order.status === 'done') {
          acc.doneOrders++  
          acc.totalRevenue += order.totalOrderPrice
        }
        return acc;
      },
      { preparingOrders: 0, deliveringOrders: 0, doneOrders: 0, orderLength: 0, totalRevenue: 0 }
    );

    const productStats = products.reduce(
      (acc, product) => {
        acc.productLength++
        if (product.deletedAt !== null) acc.deletedProducts++
        if (product.categories === 'skincare') acc.allSkincareProducts++
        if (product.categories === 'makeup') acc.allMakeupProducts++
        return acc;
      },
      { deletedProducts: 0, allSkincareProducts: 0, allMakeupProducts: 0, productLength: 0 }
    );

    const maxValueOrder = orders[0] || { _id: '', totalOrderPrice: 0 }
    const maxValueOrderId = maxValueOrder._id?.toString() || ''
    const maxValueOrderNumber = maxValueOrder.totalOrderPrice
    const employeeLength = employees.length
    const customerLength = customers.length
    const storeLength    = stores.length

    res.render('admin/home', { title: 'Trang chủ', layout: 'admin', index, ...orderStats, ...productStats, maxValueOrderId, maxValueOrderNumber, employeeLength, customerLength, storeLength});
  }
}
module.exports = new homeController