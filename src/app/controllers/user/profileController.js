const user = require('../../models/userModel')
const order = require('../../models/orderModel')

class profileController {
  async profileInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const index  = 'profile'
    const successful = req.flash('successful')

    const userInfo  = await user.findOne({ _id: userId }).lean()
    if (!userInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    res.render('users/profileInfo', { title: 'Thông tin cá nhân', isUser, index, successful, userInfo })
  }

  async orderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const index  = 'order'

    const orderInfo = await order.find({ 'customerInfo.userId': userId, deletedAt: null }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/profileOrder', { title: 'Thông tin đơn hàng', isUser, index, orderInfo })
  }

  async rateOrderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const index  = 'rateOrder'

    const orderInfo = await order.find({ 'customerInfo.userId': userId, deletedAt: null, status: 'done' }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/profileRateOrder', { title: 'Đánh giá đơn hàng', isUser, index, orderInfo })
  }

  async profileUpdate(req, res, next) {
    const userId = req.cookies.uid || null

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
    const userId = req.cookies.uid || null
    const index  = 'feedback'

    res.render('users/profileFeedback', { title: 'Góp ý cửa hàng', isUser, index, userId })
  }
}
module.exports = new profileController