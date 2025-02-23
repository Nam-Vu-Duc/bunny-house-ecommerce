const user = require('../../models/userModel')
const order = require('../../models/orderModel')
const memberShip = require('../../models/memberModel')
const orderStatus = require('../../models/orderStatusModel')

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

    const orderInfo = await order.aggregate([
      {
        $match: { 'customerInfo.userId': userId } // Filter by userId first
      },
      {
        $lookup: {
          from: 'orderStatuses',    // Join with orderStatuses collection
          localField: 'status',     // Match 'status' field in orders
          foreignField: 'code',     // Match 'code' field in orderStatuses
          as: 'orderStatus'         // Output field
        }
      },
      {
        $unwind: { 
          path: "$orderStatus", 
          preserveNullAndEmptyArrays: true  // Keep orders even if status not found
        }
      }
    ])
    if (!orderInfo) return res.json({data: {}})

    return res.json({data: orderInfo})
  }

  async getDoneOrders(req, res, next) {
    const userId = req.body.id 
    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userInfo) return res.json({data: {}})

    // const orderInfo = await order.find({ 'customerInfo.userId': userId, status: 'done' }).lean()
    const orderInfo = await order.aggregate([
      {
        $match: {$and: [{ 'customerInfo.userId': userId }, { status: 'done' }]}
      },
      {
        $lookup: {
          from: 'orderStatuses',    // Join with orderStatuses collection
          localField: 'status',     // Match 'status' field in orders
          foreignField: 'code',     // Match 'code' field in orderStatuses
          as: 'orderStatus'         // Output field
        }
      },
      {
        $unwind: { 
          path: "$orderStatus", 
          preserveNullAndEmptyArrays: true  // Keep orders even if status not found
        }
      }
    ])
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
    const userExist = await user.findOne({ email: req.body.email })
    if (userExist) return res.json({isValid: false, message: 'Email đã tồn tại'})

    await user.updateOne({ _id: req.body.id}, {
      name    : req.body.name,
      email   : req.body.email,
      phone   : req.body.phone,
      gender  : req.body.gender,
      address : req.body.address,
    })

    return res.json({isValid: false, message: 'Cập nhật thông tin thành công'})
  }
}
module.exports = new profileController