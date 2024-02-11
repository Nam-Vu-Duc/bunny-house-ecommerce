const product = require('../models/productModel')

class newArrivalController {
  show(req, res, next) {
    product.find({ deletedAt: null, newArrival: 'yes' }).lean().sortable(req)
      .then(product => { 
        res.render('users/newArrival', { title: 'Sản phẩm mới ra lòoooo', product }) })
      .catch(next)
  }
}

module.exports = new newArrivalController