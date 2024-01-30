const product = require('../models/productModel')

class newArrivalController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const newArrivalProduct = product.filter(product => product.price === 100000)
        res.render('users/newArrival', { newArrivalProduct }) })
      .catch(next)
  }
}

module.exports = new newArrivalController