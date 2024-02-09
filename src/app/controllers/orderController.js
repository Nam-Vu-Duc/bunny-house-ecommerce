const product = require('../models/productModel')

class orderController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const newArrivalProduct = product.filter(product => product.newArrival === 'yes')
        res.render('users/orders', { title: 'Đơn hàng', newArrivalProduct }) })
      .catch(next)
  }
}

module.exports = new orderController