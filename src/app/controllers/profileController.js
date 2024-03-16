const user = require('../models/userModel')
const order = require('../models/orderModel')

class profileController {
  updateProfile(req, res, next) {
    user.findOne({ _id: req.params.id }).lean()
      .then(user => {
        order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
        .then(order => {
          for (let i = 0; i < order.length; ++i) {
            order[i].totalOrderPrice = order[i].totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
          res.render('users/updateProfile', { title: 'Cập nhật thông tin', user, order })
        })
        .catch(next)
        
      })
      .catch(next)
  }

  updatedProfile(req, res, next) {
    user.updateOne({ _id: req.params.id}, {
      'userInfo.name': req.body.name,
      'userInfo.phone': req.body.phone,
      'userInfo.gender': req.body.gender,
      'userInfo.address': req.body.address,
    })
      .then(() => res.redirect('back'))
      .catch(next)
  }
}

module.exports = new profileController