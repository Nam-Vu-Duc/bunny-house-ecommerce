const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const memberShip = require('../../models/memberModel')

class profileController {
  async getUser(req, res, next) {
    const userId = req.body.id 
    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userId) return res.json({data: {}})

    const userMemberShip = await memberShip.findOne({ code: userInfo.memberCode })

    return res.json({data: userInfo, member: userMemberShip})
  }

  async getOrders(req, res, next) {
    const userId = req.body.id 
    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userInfo) return res.json({data: {}})

    const orderInfo = await order.find({ 'customerInfo.userId': userId }).lean()
    if (!orderInfo) return res.json({data: {}})

    return res.json({data: orderInfo})
  }

  async getDoneOrders(req, res, next) {
    const userId = req.body.id 
    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userInfo) return res.json({data: {}})

    const orderInfo = await order.find({ 'customerInfo.userId': userId, status: 'done' }).lean()
    if (!orderInfo) return res.json({data: {}})

    return res.json({data: orderInfo})
  }

  async profileInfo(req, res, next) {
    const userId = req.params.id || null
    if (!userId) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    return res.render('users/profileInfo', { title: 'Thông tin cá nhân' })
  }

  async profileUpdate(req, res, next) {
    console.log(req.body)
    return res.json({message: true})

    await user.updateOne({ _id: userId}, {
      name    : req.body.name,
      phone   : req.body.phone,
      gender  : req.body.gender,
      address : req.body.address,
    })

    req.flash('successful', 'Cập nhật thông tin thành công')
    res.redirect(req.get('Referrer') || '/')
  }
  
  async feedBack(req, res, next) {
    const index  = 'feedback'

    res.render('users/profileFeedback', { title: 'Góp ý cửa hàng', index })
  }
}
module.exports = new profileController