const order = require('../models/orderModel')

class productController {
  show(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => { 
        if (order) {
          order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
        }
        res.render('users/order', { title: `Đơn ${order._id}` , order }) })
      .catch(next)
  }
}

module.exports = new productController