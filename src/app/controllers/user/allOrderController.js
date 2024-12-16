const order = require('../../models/orderModel')

class orderController {
  show(req, res, next) {
    const successful = req.flash('successful')
    const newOrderId = req.flash('newOrderId')
    res.render('users/allOrders', { title: 'Đơn hàng', successful, newOrderId })
  }

  showOrder(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => { 
        // order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
        res.render('users/order', { title: `Đơn của ${order.customerInfo.name}` , order }) })
      .catch(next)
  }

  ordersChecking(req, res, next) {
    res.render('users/ordersChecking', { title: 'Kiểm Tra Đơn Hàng' })
  }

  orderChecked(req, res, next) {
    // if matched, then find it in db
    order.findOne({ _id: req.params.id }).lean()
    .then(order => {
      res.render('users/ordersChecking', { title: 'Kiểm Tra Đơn Hàng', order })
    })
    .catch(next)
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
      .then(() => {
        const newOrderId = newOrder._id
        req.flash('newOrderId', newOrderId)
        req.flash('successful', 'order successfully')
        return res.redirect('/all-orders')
      })
      .catch(next)
  }
}
module.exports = new orderController