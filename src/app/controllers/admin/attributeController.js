const member = require('../../models/memberModel')
const orderStatus = require('../../models/orderStatusModel')
const paymentMethod = require('../../models/paymentMethodModel')
const position = require('../../models/positionModel')
const productStatus = require('../../models/productStatusModel')

class attributeController {
  async show(req, res, next) {
    return res.render('admin/attribute', { title: 'Chỉnh sửa thuộc tính', layout: 'admin' })
  }

  async getMembership(req, res, next) {
    const membership = await member.find().lean()
    return res.json({data: membership})
  }

  async getOrderStatus(req, res, next) {
    const orderStatuses = await orderStatus.find().lean()
    return res.json({data: orderStatuses})
  }

  async getPaymentMethod(req, res, next) {
    const paymentMethods = await paymentMethod.find().lean()
    return res.json({data: paymentMethods})
  }

  async getPosition(req, res, next) {
    const positions = await position.find().lean()
    return res.json({data: positions})
  }

  async getProductStatus(req, res, next) {
    const productStatuses = await productStatus.find().lean()
    return res.json({data: productStatuses})
  }
}
module.exports = new attributeController