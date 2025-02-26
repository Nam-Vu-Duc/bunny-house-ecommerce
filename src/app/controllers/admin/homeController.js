const product = require('../../models/productModel')
const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const store = require('../../models/storeModel')
const brand = require('../../models/brandModel')
const employee = require('../../models/employeeModel')

class homeController {
  async show(req, res, next) {
    res.render('admin/home', { title: 'Trang chủ', layout: 'admin' });
  }
}
module.exports = new homeController