const order = require('../../models/orderModel')

class allOrderController {
  show(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id ? req.cookies.user_id : null
    const successful = req.flash('successful')
    const newOrderId = req.flash('newOrderId')
    res.render('users/allOrders', { title: 'Đơn hàng', successful, newOrderId, isUser, userId })
  }

  async orderInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const orderInfo = await order.findOne({ _id: req.params.id }).lean()
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
      productName       = [productName]
      productPrice      = [productPrice]
      productQuantity   = [productQuantity]
      productTotalPrice = [productTotalPrice]
    }

    const newOrder = new order({
      products: productName.map((product, index) => ({
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
    });

    await newOrder.save()
    req.flash('newOrderId', newOrder._id)
    req.flash('successful', 'order successfully')
    return res.redirect('/all-orders')
  }
}
module.exports = new allOrderController