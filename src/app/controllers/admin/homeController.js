const product = require('../../models/productModel')
const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const store = require('../../models/storeModel')
const brand = require('../../models/brandModel')
const employee = require('../../models/employeeModel')

class homeController {
  async show(req, res, next) {
    const index      = 'home'
    const successful = req.flash('successful')

    const [orders, products, employees, customers, stores, brands] = await Promise.all([
      order.find({ deletedAt: null }).sort({ totalOrderPrice: -1 }).lean(),
      product.find().lean(),
      employee.find().lean(),
      user.find({ deletedAt: null }).lean(),
      store.find({}).lean(),
      brand.find({}).lean()
    ])

    const [totalEmployee, totalCustomer, totalStore, totalBrand] = await Promise.all([
      employee.countDocuments(),
      user.countDocuments(),
      store.countDocuments(),
      brand.countDocuments()
    ])

    const orderStats = orders.reduce(
      (acc, order) => {
        acc.totalOrder++
        if (order.status === 'preparing') acc.preparingOrders++
        if (order.status === 'delivering') acc.deliveringOrders++
        if (order.status === 'done') {
          acc.doneOrders++  
          acc.totalRevenue += order.totalOrderPrice
        }
        return acc;
      },
      { preparingOrders: 0, deliveringOrders: 0, doneOrders: 0, totalOrder: 0, totalRevenue: 0 }
    );

    const productStats = products.reduce(
      (acc, product) => {
        acc.totalProduct++
        if (product.deletedAt !== null) acc.deletedProducts++
        if (product.categories === 'skincare') acc.allSkincareProducts++
        if (product.categories === 'makeup') acc.allMakeupProducts++
        return acc;
      },
      { deletedProducts: 0, allSkincareProducts: 0, allMakeupProducts: 0, totalProduct: 0 }
    );

    const maxValueOrder = orders[0] || { _id: '', totalOrderPrice: 0 }
    const maxValueOrderId = maxValueOrder._id?.toString() || ''
    const maxValueOrderNumber = maxValueOrder.totalOrderPrice

    const name = customers.map(cus => cus.name)

    res.render('admin/home', { title: 'Trang chủ', layout: 'admin', index, successful, ...orderStats, ...productStats, maxValueOrderId, maxValueOrderNumber, totalEmployee, totalCustomer, totalStore, totalBrand, name });
  }
}
module.exports = new homeController