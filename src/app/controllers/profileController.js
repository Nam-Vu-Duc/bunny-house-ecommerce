const user = require('../models/userModel')
const order = require('../models/orderModel')

class profileController {
  updateProfile(req, res, next) {
    user.findOne({ _id: req.params.id }).lean()
      .then(user => {
        res.render('users/updateProfile', { title: 'Cập nhật thông tin', user })
      })
      .catch(next)
  }

  updatedProfile(req, res, next) {
    // user.updateOne({ _id: req.params.id }, req.body)
    //   .then(user => {
    //     res.redirect('/home')
    //   })
    //   .catch(next)
    res.json(req.body)
  }

  orders(req, res, next) {
    order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
      .then(order => {
        for (let i = 0; i < order.length; ++i) {
          order[i].totalProductPrice = order[i].totalProductPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          order[i].createdAt = order[i].createdAt.getDate() + '/' + (order[i].createdAt.getMonth()+1) + '/' + order[i].createdAt.getFullYear()
          if (order[i].status === 'preparing') {
            order[i].status = 'Đang Xử Lý'
          } 
          if (order[i].status === 'delivering') {
            order[i].status = 'Đang Giao Cho Khách'
          } 
          if (order[i].status === 'done') {
            order[i].status = 'Đã Hoàn Thành'
          } 
        }
        res.render('users/ordersProfile', { title: 'Tổng Đơn Hàng Của Bạn', order })
      })
      .catch(next)
  }
}

module.exports = new profileController