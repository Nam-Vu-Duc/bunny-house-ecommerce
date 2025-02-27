const product = require('../../models/productModel')
const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const store = require('../../models/storeModel')
const brand = require('../../models/brandModel')
const employee = require('../../models/employeeModel')
const purchase = require('../../models/purchaseModel')
const supplier = require('../../models/supplierModel')

class homeController {
  async show(req, res, next) {
    res.render('admin/home', { title: 'Trang chủ', layout: 'admin' })
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
}
module.exports = new homeController