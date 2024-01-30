const product = require('../models/productModel')

class introduceController {
  show(req, res, next) {
    res.render('users/introduce')
  }
}

module.exports = new introduceController