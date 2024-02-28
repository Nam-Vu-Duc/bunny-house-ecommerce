const product = require('../models/productModel')

class orderController {
  show(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  ordersProgress(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  createOrders(req, res, next) {
    // let newProduct = new product(req.body)
    // if (req.file) {
    //   newProduct.avatar = req.file.filename
    // }
    // newProduct.save()
    //   .then(() => res.redirect('/admin/update'))
    //   .catch(next)
    res.json(req.body)
  }
}

module.exports = new orderController