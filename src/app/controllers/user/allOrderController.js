const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const store = require('../../models/storeModel')
const product = require('../../models/productModel')
const comment = require('../../models/commentModel')

class allOrderController {
  async show(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id ? req.cookies.user_id : null

    const successful = req.flash('successful')
    const newOrderId = req.flash('newOrderId')

    let userInfo = []
    if(userId) userInfo = await user.findOne({ _id: userId }).lean()
    const storeInfo = await store.find({}).lean()

    res.render('users/allOrders', { title: 'Đơn hàng', successful, newOrderId, isUser, userId, userInfo, storeInfo })
  }

  async orderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    
    const orderInfo = await order.findOne({ _id: req.params.id }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/detailOrder', { title: `Đơn của ${orderInfo.customerInfo.name}`, orderInfo, isUser })
  }

  ordersChecking(req, res, next) {
    const isUser = req.isUser === true ? true : false
    res.render('users/ordersChecking', { title: 'Kiểm Tra Đơn Hàng', isUser })
  }

  async orderChecked(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const orderInfo = await order.findOne({ _id: req.params.id }).lean()
    res.render('users/ordersChecking', { title: 'Kiểm Tra Đơn Hàng', orderInfo, isUser })
  }

  async createOrders(req, res, next) {
    let { 
      productId,
      productName, 
      productPrice, 
      productQuantity,  
      productTotalPrice, 
      totalOrderPrice, 
      paymentMethod, 
      ...customerInfo 
    } = req.body

    // if the req.body has only 1 record, then convert the productName % productQuantity to an array
    if(!Array.isArray(productName)) {
      productId         = [productId]
      productName       = [productName]
      productPrice      = [productPrice]
      productQuantity   = [productQuantity]
      productTotalPrice = [productTotalPrice]
    }

    const newOrder = new order({
      products: productName.map((product, index) => ({
        id        : productId[index],   
        name      : productName[index],
        price     : productPrice[index],
        quantity  : productQuantity[index],
        totalPrice: productTotalPrice[index]
      })),
      customerInfo: {
        userId  : customerInfo.userId,
        name    : customerInfo.name,
        phone   : customerInfo.phone,
        address : customerInfo.address,
        note    : customerInfo.note
      },
      totalOrderPrice: totalOrderPrice,
      paymentMethod: paymentMethod
    })

    await newOrder.save()
    req.flash('newOrderId', newOrder._id)
    req.flash('successful', 'order successfully')
    return res.redirect('/all-orders')
  }

  async rateOrder(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id ? req.cookies.user_id : null
    const orderId = req.params.id
    const successful = req.flash('successful')

    const orderInfo = await order.findOne({ _id: req.params.id, status: 'done' }).lean()
    if (!orderInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    const commentInfo = await comment.find({ orderId: orderId, senderId: userId }).lean()

    res.render('users/detailRateOrder', { title: 'Đánh giá đơn hàng', isUser, successful, orderInfo })
  }
  
  async orderRated(req, res, next) {
    const senderId = req.cookies.user_id ? req.cookies.user_id : null
    const orderId = req.params.id
    const {
      productId,
      productComment,
      productRate
    } = req.body

    if(!Array.isArray(productId)) {
      productId      = [productId]
      productComment = [productComment]
      productRate    = [productRate]
    }

    await comment.insertMany(productId.map((id, index) => (
      {
        orderId: orderId,
        productId: id,
        senderId: senderId,
        comment: productComment[index],
      }
    )))

    await order.updateOne({ _id: orderId }, {
      isRated: true
    })

    const bulkOps = productId.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: [{
          $set: {
            rate: { 
              $divide: [
                { $add: [{ $multiply: ["$rate", "$rateNumber"] }, parseInt(productRate[index])] },
                { $add: ["$rateNumber", 1] }
              ]
            },
            rateNumber: { $add: ["$rateNumber", 1] }
          }
        }]
      }
    }));
    await product.bulkWrite(bulkOps)

    req.flash('successful', 'rate successfully')
    res.redirect(req.get('Referrer') || '/')
  }
}
module.exports = new allOrderController