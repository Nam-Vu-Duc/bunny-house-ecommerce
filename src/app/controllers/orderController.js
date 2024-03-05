const order = require('../models/orderModel')

class orderController {
  show(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
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
    let { productName, productQuantity, totalProductPrice, paymentMethod, ...customerInfo } = req.body

    // if the req.body has only 1 record, then convert the productName % productQuantity to an array
    if(!Array.isArray(productName)) {
      productName = [productName]
      productQuantity = [productQuantity]
    }

    const newOrder = new order({
      products: productName.map((product, index) => ({
        name: productName[index],
        quantity: parseInt(productQuantity[index])
      })),
      customerInfo: {
        userId: customerInfo.userId,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        note: customerInfo.note
      },
      totalProductPrice: totalProductPrice,
      paymentMethod: paymentMethod
    });

    await newOrder.save()
      .then(() => res.json({ message: 'sucessfully' }))
      .catch(next)
  }
}

module.exports = new orderController