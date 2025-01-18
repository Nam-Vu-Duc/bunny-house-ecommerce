const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const product = require('../../models/productModel')
const store = require('../../models/storeModel')

class allOrdersController {
  async allOrders(req, res, next) {
    const index = 'orders'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const orderType    = req.query.type || ''
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [orders, totalOrder] = await Promise.all([
      order.find({ deletedAt: null }).sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage).lean(),
      order.find({ deletedAt: null }).countDocuments()
    ])

    // if (orderType !== '') orders = orders.filter(order => order.status === orderType)

    res.render('admin/all/order', { title: 'Danh sách đơn hàng', layout: 'admin', index, successful, orders, orderType, totalOrder, currentPage })
  }

  async orderInfo(req, res, next) {
    const index = 'orders'
    const successful = req.flash('successful')

    const orderInfo = await order.findOne({ _id: req.params.id }).lean()

    res.render('admin/detail/order', { title: `Đơn hàng ${orderInfo.customerInfo.name}`, layout: 'admin', index, successful, orderInfo })
  }

  async orderUpdate(req, res, next) {
    const status = req.body.status

    await order.updateOne({ _id: req.params.id }, { 
      status: status
    })

    if (status === 'done') {
      const orderInfo = await order.findOne({ _id: req.params.id }).lean()
      const userId = orderInfo.customerInfo.userId
      const storeId = orderInfo.storeId

      // update product quantity
      const productInfo = orderInfo.products.map(product => ({id: product.id, quantity: product.quantity}))
      const bulkOps = productInfo.map(({ id, quantity }) => ({
        updateOne: {
          filter: { _id: id },
          update: { $inc: { quantity: -quantity } }, 
          upsert: true,
        },
      }))
      await product.bulkWrite(bulkOps)

      await store.updateOne({ _id: storeId }, {
        $inc: { revenue: orderInfo.totalOrderPrice }
      })

      if(userId !== 'guest') {
        await user.updateOne({ _id: userId }, {
          $inc: { 
            revenue: orderInfo.totalOrderPrice,
            quantity: 1
          }
        })
      }
    }

    req.flash('successful', 'Cập nhật đơn hàng thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }

  async orderCreate(req, res, next) {
    const index = 'orders'
    const [users, products] = await Promise.all([
      user.find({}).lean(),
      product.find({ deletedAt: null }).lean()
    ]) 
  
    res.render('admin/create/order', { title: 'Thêm đơn hàng mới', layout: 'admin', index, users, products })
  }

  async orderCreated(req, res, next) {
    let { 
      orderDate, 
      userId,
      paymentMethod,
      note,
      productId, 
      productName,
      productPrice,
      productQuantity,
      totalOrderPrice
    } = req.body

    // if the req.body has only 1 record, convert 1 record to array
    if(!Array.isArray(productId)) {
      productId       = [productId]
      productQuantity = [productQuantity]
    }

    const userInfo = await user.findOne({ _id: userId }).lean()

    const newOrder = new order({
      products: productId.map((product, index) => ({
        id        : productId[index],
        name      : productName[index],
        price     : productPrice[index],
        quantity  : productQuantity[index], 
        totalPrice: productPrice[index] * productQuantity[index]
      })),
      customerInfo: {
        userId  : userId,
        name    : userInfo.userInfo.name,
        phone   : userInfo.userInfo.phone,
        address : userInfo.userInfo.address,
        note    : note
      },
      paymentMethod   : paymentMethod,
      createdAt       : orderDate,
      totalOrderPrice : totalOrderPrice
    });

    await newOrder.save()
    req.flash('successful', 'Thêm đơn hàng thành công')
    return res.redirect('/admin/all-orders')
  }
}
module.exports = new allOrdersController