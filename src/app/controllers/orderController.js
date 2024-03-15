const order = require('../models/orderModel')

class orderController {
  show(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => { 
        if (order) {
          order.products.forEach(product => {
            product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            product.totalPrice = product.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          });
          order.totalOrderPrice = order.totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
          if (order.status === 'preparing') {
            order.status = 'Đang Xử Lý'
          } 
          if (order.status === 'delivering') {
            order.status = 'Đang Giao'
          } 
          if (order.status === 'done') {
            order.status = 'Đã Hoàn Thành'
          } 
        }
        res.render('users/order', { title: `Đơn của ${order.customerInfo.name}` , order }) })
      .catch(next)
  }
}

module.exports = new orderController