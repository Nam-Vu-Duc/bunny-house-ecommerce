const order = require('../../models/orderModel')

class allOrdersController {
  allOrders(req, res, next) {
    const index = 'orders'
    const currentPage  = req.query.page || 1
    const orderType    = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    order.find({ deletedAt: null }).sort({'createdAt': -1}).lean()
      .then(order => {
        const orderLength = order.length
        if (orderType !== '') order = order.filter(order => order.status === orderType)
        order = order.slice(skip, skip + itemsPerPage)

        res.render('admin/all/order', { title: 'Danh sách đơn hàng', layout: 'admin', orderLength, orderType, currentPage, index, order })
      })
      .catch(next)
  }

  orderInfo(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => {
        const index = 'orders'
        res.render('admin/detail/order', { title: `Đơn ${order.customerInfo.name}`, layout: 'admin', order,index })
      })
      .catch(next)
  }

  orderUpdate(req, res, next) {
    order.updateOne({ _id: req.params.id }, { status: req.body.status })
      .then(() => { 
        res.redirect('back')})
      .catch(next)
  }

  orderCreate(req, res, next) {
    const index = 'orders'
    res.render('admin/create/order', { title: 'Thêm đơn hàng mới', layout: 'admin', index })
  }

  orderCreated(req, res, next) {

  }
}
module.exports = new allOrdersController