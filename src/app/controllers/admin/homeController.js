const product = require('../../models/productModel')
const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const store = require('../../models/storeModel')
const brand = require('../../models/brandModel')
const employee = require('../../models/employeeModel')
const purchase = require('../../models/purchaseModel')
const supplier = require('../../models/supplierModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class homeController {
  async show(req, res, next) {
    return res.render('admin/home', { title: 'Trang chủ', layout: 'admin' })
  }

  async getFinance(req, res, next) {
    const { startDate, endDate } = req.query
    const start = new Date(startDate)
    const end = new Date(endDate)
    const revenue = await order.aggregate([
      // {
      //   $match: {
      //     createdAt: {
      //       $gte: start,
      //       $lt: end,
      //     },
      //   },
      // },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalOrderPrice' },
        },
      },
    ])
    console.log(revenue)

    const cost = await purchase.aggregate([
      // {
      //   $match: {
      //     createdAt: {
      //       $gte: start,
      //       $lt: end,
      //     },
      //   },
      // },
      {
        $group: {
          _id: null,
          cost: { $sum: '$totalPurchasePrice' },
        },
      },
    ])
    console.log(cost)

    const wage = await employee.aggregate([
      // {
      //   $match: {
      //     createdAt: {
      //       $gte: start,
      //       $lt: end,
      //     },
      //   },
      // },
      {
        $lookup: {
          from: 'positions',
          localField: 'role',
          foreignField: 'code',
          as: 'position',
        },
      },
      {
        $unwind: '$position'
      },
      {
        $group: {
          _id: null,
          wage: { $sum: '$position.wage' },
        },
      },
    ])
    console.log(wage)
    return res.json({ 
      revenue: revenue[0].revenue, 
      cost: cost[0].cost, 
      wage: wage[0].wage,
    })
  }

  async getBrands(req, res, next) {
    const brands = await brand.find().lean()
    return res.json({data: brands})
  }

  async getCustomers(req, res, next) {
    const customers = await user.find().lean()
    return res.json({data: customers})
  }

  async getEmployees(req, res, next) {
    const employees = await employee.find().lean()
    return res.json({data: employees})
  }

  async getOrders(req, res, next) {
    const orders = await order.find().lean()
    return res.json({data: orders})
  }

  async getProducts(req, res, next) {
    const products = await product.find({ deletedAt: null }).lean()
    return res.json({data: products})
  }

  async getPurchases(req, res, next) {
    const purchases = await purchase.find().lean()
    return res.json({data: purchases})
  }

  async getStores(req, res, next) {
    const stores = await store.find().lean()
    return res.json({data: stores})
  }

  async getSuppliers(req, res, next) {
    const suppliers = await supplier.find().lean()
    return res.json({data: suppliers})
  }
  
  async getUser(req, res, next) {
    try {
      const userId = req.cookies.uid || ''
      if (!userId) return res.json({message: false})
      
      const userInfo = await employee.findOne({ _id: userId }).lean()
      if (!userInfo) return res.json({message: false})
      
      return res.json({message: true, data: userInfo})
      
    } catch (error) {
      return res.json({message: error})
    }
  }
}
module.exports = new homeController