const user = require('../../models/userModel')
const order = require('../../models/orderModel')

class profileController {
  async updateProfile(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id
    const userInfo  = await user.findOne({ _id: userId }).lean()
    const orderInfo = await order.find({ 'customerInfo.userId': userId, deletedAt: null }).lean()
    // order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
    res.render('users/profile', { title: 'Thông tin cá nhân', userInfo, orderInfo, isUser })
  }

  async updatedProfile(req, res, next) {
    const userId = req.cookies.user_id
    await user.updateOne({ _id: userId}, {
      'userInfo.name'    : req.body.name,
      'userInfo.phone'   : req.body.phone,
      'userInfo.gender'  : req.body.gender,
      'userInfo.address' : req.body.address,
    })
    res.redirect('back')
  }
}
module.exports = new profileController