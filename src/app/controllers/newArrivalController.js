const product = require('../models/productModel')

class newArrivalController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const newArrivalProduct = product.filter(product => product.newArrival === 'yes')
        res.render('users/newArrival', { title: 'Sản phẩm mới ra lòoooo', newArrivalProduct }) })
      .catch(next)
  }
}

module.exports = new newArrivalController