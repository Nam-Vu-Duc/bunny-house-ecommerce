const order = require('../models/orderModel')

class orderController {
  show(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  ordersProgress(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  async createOrders(req, res, next) {
    let { productName, productQuantity, totalProductPrice, ...customerInfo } = req.body

    if(!Array.isArray(productName)) {
      productName = [productName]
      productQuantity = [productQuantity]
    }

    const newOrder = new order({
      products: productName.map((product, index) => ({
        name: productName[index],
        quantity: parseInt(productQuantity[index])
      })),
      totalProductPrice: totalProductPrice,
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        note: customerInfo.note
      },
    });

    await newOrder.save()
      .then(() => res.json({ message: 'sucessfully' }))
      .catch(next)
  }
}

module.exports = new orderController