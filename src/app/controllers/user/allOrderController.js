const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const store = require('../../models/storeModel')
const product = require('../../models/productModel')
const comment = require('../../models/commentModel')
const orderStatus = require('../../models/orderStatusModel')

class allOrderController {
  async getOrder(req, res, next) {
    const orderInfo = await order.findOne({ _id: req.body.id }).lean()
    if (!orderInfo) return res.json({message: 'order not found'})
    const status = await orderStatus.findOne({ code: orderInfo.status })

    return res.json({data: orderInfo, status: status})
  }
  
  async show(req, res, next) {
    res.render('users/allOrders', { title: 'Đơn hàng' })
  }

  async orderInfo(req, res, next) {
    const id = req.cookies.uid || null
    console.log(id)
    if (!id) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    const orderInfo = await order.findOne({ _id: req.params.id }).lean()
    if (!orderInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const userInfo = await user.findOne({ _id: orderInfo.customerInfo.userId }).lean()
    if (!userInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    if (userInfo._id.toString() !== id ) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/detailOrder', { title: `Đơn của ${orderInfo.customerInfo.name}` })
  }

  async ordersChecking(req, res, next) {
    res.render('users/ordersChecking', { title: 'Kiểm Tra Đơn Hàng' })
  }

  async createOrders(req, res, next) {
    let { 
      productId,
      productImg,
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
      productImg        = [productImg]
      productName       = [productName]
      productPrice      = [productPrice]
      productQuantity   = [productQuantity]
      productTotalPrice = [productTotalPrice]
    }

    const newOrder = new order({
      products: productName.map((product, index) => ({
        id        : productId[index],   
        image     : productImg[index],
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

    return res.json({message: true, id: newOrder._id})
  }

  async rateOrder(req, res, next) {
    const id = req.cookies.uid || null
    if (!id) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    const orderInfo = await order.findOne({ _id: req.params.id }).lean()
    if (!orderInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const userInfo = await user.findOne({ _id: orderInfo.customerInfo.userId }).lean()
    if (!userInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    if (userInfo._id.toString() !== id ) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/detailRateOrder', { title: 'Đánh giá đơn hàng' })
  }
  
  async orderRated(req, res, next) {
    const {
      orderId,
      senderId,
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
        rate: productRate[index]
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

    res.json({message: true})
  }
}
module.exports = new allOrderController