const product = require('../models/productModel')

class orderController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const newArrivalProduct = product.filter(product => product.newArrival === 'yes')
        res.render('users/orders', { title: 'Đơn hàng', newArrivalProduct }) })
      .catch(next)
  }

  createOrders(req, res, next) {
    // let newProduct = new product(req.body)
    // if (req.file) {
    //   newProduct.avatar = req.file.filename
    // }
    // newProduct.save()
    //   .then(() => res.redirect('/admin/update'))
    //   .catch(next)
    res.json(req.body)
  }
}

module.exports = new orderController