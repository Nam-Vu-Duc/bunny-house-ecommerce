const order = require('../models/orderModel')

class orderController {
  show(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  ordersProgress(req, res, next) {
    res.render('users/orders', { title: 'Đơn hàng' })
  }

  async createOrders(req, res, next) {
    // const newOrder = new order({
    //   products: products.map((product, index) => ({ // Map to desired format
    //     name: product[`productName_${index}`],
    //     quantity: parseInt(product[`productQuantity_${index}`]) // Handle potential parsing errors
    //   })),
    //   totalProductPrice,
    //   customerInfo
    // });

    // await newOrder.save()
    //   .then(() => res.json({ message: 'sucessfully' }))
    //   .catch(next)

  }
}

module.exports = new orderController