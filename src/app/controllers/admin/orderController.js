const order = require('../../models/orderModel')
const user = require('../../models/userModel')
const product = require('../../models/productModel')

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

  orderInfo(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => {
        const index = 'orders'
        res.render('admin/detail/order', { title: `Đơn ${order.customerInfo.name}`, layout: 'admin', order,index })
      })
      .catch(next)
  }

  async orderUpdate(req, res, next) {
    await order.updateOne({ _id: req.params.id }, { status: req.body.status })
    res.redirect('back')
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

    const newOrder = new order({
      products: productId.map((product, index) => ({
        id        : productId[index],
        name      : productName[index],
        price     : productPrice[index],
        quantity  : productQuantity[index], 
      })),
      userId: userId,
      note: note,
      createdAt: orderDate,
      totalOrderPrice: totalOrderPrice
    });

    await newOrder.save()
    req.flash('successful', 'order successfully')
    return res.redirect('/admin/all-purchases')
  }
}
module.exports = new allOrdersController