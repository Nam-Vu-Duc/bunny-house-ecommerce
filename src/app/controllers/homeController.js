const product = require('../models/productModel')

class homeController {
  // get /home
  async index(req, res, next) {
    try {
      const data = await product.find({}).lean();
        res.render('home', { data })
    } catch (err) {
        res.status(400).json({error: err});
    }
  }
}

module.exports = new homeController