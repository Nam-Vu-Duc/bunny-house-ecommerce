const product = require('../models/productModel')

class newArrivalController {
  show(req, res, next) {
    res.render('users/newArrival')
  }
}

module.exports = new newArrivalController