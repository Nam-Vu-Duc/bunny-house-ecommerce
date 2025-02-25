const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const product = require('../../models/productModel')
const store = require('../../models/storeModel')
const orderStatus = require('../../models/orderStatusModel')
const paymentMethod = require('../../models/paymentMethodModel')

class allOrdersController {
  // all
  async getOrders(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      order
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      order.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getFilter(req, res, next) {
    const [orderStatuses, paymentMethods] = await Promise.all([
      orderStatus.find().lean(),
      paymentMethod.find().lean(),
    ]) 

    console.log(orderStatuses, paymentMethods)
    res.json({ orderStatus: orderStatuses, paymentMethod: paymentMethods })
  }

  async allOrders(req, res, next) {
    res.render('admin/all/order', { title: 'Danh sách đơn hàng', layout: 'admin' })
  }

  // update
  async getOrder(req, res, next) {
    const [orderInfo, orderStatuses, paymentMethods] = await Promise.all([
      order.findOne({ _id: req.body.id }).lean(),
      orderStatus.find({}).lean(),
      paymentMethod.find({}).lean()
    ])
    if (!orderInfo) return res.json({orderInfo: null})

    return res.json({orderInfo: orderInfo, orderStatuses: orderStatuses, paymentMethods: paymentMethods})
  }

  async orderInfo(req, res, next) {
    res.render('admin/detail/order', { layout: 'admin' })
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
  }

  // create
  async getCustomers(req, res, next) {
    const customers = await user.find().lean()
    return res.json({data: customers})
  }

  async getStores(req, res, next) {
    const stores = await store.find().lean()
    return res.json({data: stores})
  }

  async getPaymentMethod(req, res, next) {
    const paymentMethods = await paymentMethod.find().lean()
    return res.json({data: paymentMethods})
  }
  
  async getProducts(req, res, next) {
    const query = req.body.query
    const products = await product.find({
      deletedAt: null,
      name: { $regex: query, $options: 'i'}
    }).lean()
    return res.json({data: products})
  }

  async orderCreate(req, res, next) {  
    res.render('admin/create/order', { title: 'Thêm đơn hàng mới', layout: 'admin' })
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
      productImg,
      productPrice,
      productQuantity,
      totalOrderPrice
    } = req.body

    // if the req.body has only 1 record, convert 1 record to array
    if(!Array.isArray(productId)) {
      productId       = [productId]
      productName     = [productName]
      productImg      = [productImg]
      productPrice    = [productPrice]
      productQuantity = [productQuantity]
    }

    const userInfo = await user.findOne({ _id: userId }).lean()

    const newOrder = new order({
      products: productId.map((product, index) => ({
        id        : productId[index],
        name      : productName[index],
        image     : productImg[index],
        price     : productPrice[index],
        quantity  : productQuantity[index], 
        totalPrice: productPrice[index] * productQuantity[index]
      })),
      customerInfo: {
        userId  : userId,
        name    : userInfo.name,
        phone   : userInfo.phone,
        address : userInfo.address,
        note    : note
      },
      paymentMethod   : paymentMethod,
      storeId         : storeId,
      createdAt       : orderDate,
      totalOrderPrice : totalOrderPrice
    });

    await newOrder.save()
    return res.json({isValid: true, message: 'Tạo đơn hàng mới thành công'})
  }
}
module.exports = new allOrdersController