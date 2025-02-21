const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const product = require('../../models/productModel')
const store = require('../../models/storeModel')
const orderStatus = require('../../models/orderStatusModel')
const paymentMethod = require('../../models/paymentMethodModel')

class allOrdersController {
  async getOrders(req, res, next) {
    
  }

  async getOrder(req, res, next) {
    
  }

  async getFilter(req, res, next) {
  
  }

  async allOrders(req, res, next) {
    const index        = 'orders'
    const successful   = req.flash('successful')

    const currentPage  = req.query.page || 1
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null }

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = queryList[key]
      }
    }

    const [orders, totalOrder, orderStatuses, paymentMethods] = await Promise.all([
      order
      .find(filterOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .lean(),
      order.find(filterOptions).countDocuments(),
      orderStatus.find({}).lean(),
      paymentMethod.find({}).lean()
    ])

    res.render('admin/all/order', { title: 'Danh sách đơn hàng', layout: 'admin', index, successful, orders, orderStatuses, paymentMethods, totalOrder, currentPage })
  }

  async orderInfo(req, res, next) {
    const index = 'orders'
    const successful = req.flash('successful')

    const [orderInfo, orderStatuses, paymentMethods] = await Promise.all([
      order.findOne({ _id: req.params.id }).lean(),
      orderStatus.find({}).lean(),
      paymentMethod.find({}).lean()
    ])

    res.render('admin/detail/order', { title: `Đơn hàng ${orderInfo.customerInfo.name}`, layout: 'admin', index, successful, orderInfo, orderStatuses, paymentMethods })
  }

  async orderUpdate(req, res, next) {
    const status = req.body.status
    const paymentMethod = req.body.paymentMethod

    await order.updateOne({ _id: req.params.id }, { 
      status: status,
      paymentMethod: paymentMethod
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
          update: { $inc: { quantity: -quantity, saleNumber: quantity }}, 
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
    const [users, products, stores, paymentMethods] = await Promise.all([
      user.find({}).lean(),
      product.find({ deletedAt: null }).lean(),
      store.find({}).lean(),
      paymentMethod.find({}).lean()
    ]) 
  
    res.render('admin/create/order', { title: 'Thêm đơn hàng mới', layout: 'admin', index, users, products, stores, paymentMethods })
  }

  async orderCreated(req, res, next) {
    let { 
      orderDate, 
      userId,
      paymentMethod,
      note,
      storeId,
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
      storeId         : storeId,
      createdAt       : orderDate,
      totalOrderPrice : totalOrderPrice
    });

    await newOrder.save()
    req.flash('successful', 'Thêm đơn hàng thành công')
    return res.redirect('/admin/all-orders')
  }
}
module.exports = new allOrdersController