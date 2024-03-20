const user = require('../models/userModel')
const order = require('../models/orderModel')

class profileController {
  async updateProfile(req, res, next) {
    const userInfo = await user.findOne({ _id: req.params.id }).lean()
    const orderInfo = await order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
    orderInfo.forEach(order => {
      order.totalOrderPrice = order.totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
      if (order.status === 'preparing') {
        order.status = 'Đang Xử Lý'
      } 
      if (order.status === 'delivering') {
        order.status = 'Đang Giao Cho Khách'
      } 
      if (order.status === 'done') {
        order.status = 'Đã Hoàn Thành'
      } 
    });

    res.render('users/updateProfile', { title: 'Cập nhật thông tin', userInfo, orderInfo })

    // user.findOne({ _id: req.params.id }).lean()
    //   .then(user => {
    //     order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
    //     .then(order => {
    //       for (let i = 0; i < order.length; ++i) {
    //         order[i].totalOrderPrice = order[i].totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    //         order[i].createdAt = order[i].createdAt.getDate() + '/' + (order[i].createdAt.getMonth()+1) + '/' + order[i].createdAt.getFullYear()
    //         if (order[i].status === 'preparing') {
    //           order[i].status = 'Đang Xử Lý'
    //         } 
    //         if (order[i].status === 'delivering') {
    //           order[i].status = 'Đang Giao Cho Khách'
    //         } 
    //         if (order[i].status === 'done') {
    //           order[i].status = 'Đã Hoàn Thành'
    //         } 
    //       }
    //       res.render('users/updateProfile', { title: 'Cập nhật thông tin', user, order })
    //     })
    //     .catch(next)
        
    //   })
    //   .catch(next)
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