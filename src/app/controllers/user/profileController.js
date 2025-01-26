const user = require('../../models/userModel')
const order = require('../../models/orderModel')

class profileController {
  async profileInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id || null

    const userInfo  = await user.findOne({ _id: userId }).lean()
    if (!userInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    res.render('users/profileInfo', { title: 'Thông tin cá nhân', isUser, userInfo })
  }

  async orderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id || null

    const orderInfo = await order.find({ 'customerInfo.userId': userId, deletedAt: null }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/profileOrder', { title: 'Thông tin đơn hàng', isUser, orderInfo })
  }

  async rateOrderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id || null

    const orderInfo = await order.find({ 'customerInfo.userId': userId, deletedAt: null, status: 'done' }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/profileRateOrder', { title: 'Đánh giá đơn hàng', isUser, orderInfo })
  }

  async profileUpdate(req, res, next) {
    const userId = req.cookies.user_id || null

    await user.updateOne({ _id: userId}, {
      'userInfo.name'    : req.body.name,
      'userInfo.phone'   : req.body.phone,
      'userInfo.gender'  : req.body.gender,
      'userInfo.address' : req.body.address,
    })

    req.flash('successful', 'Cập nhật thông tin thành công')
    res.redirect(req.get('Referrer') || '/')
  }
  
  async feedBack(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id || null

    res.render('users/profileFeedback', { title: 'Góp ý cửa hàng', isUser, userId })
  }
}
module.exports = new profileController