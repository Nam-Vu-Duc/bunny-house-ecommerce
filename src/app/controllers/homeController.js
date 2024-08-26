const product = require('../models/productModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => {
        const flashDealProduct    = product.filter(product => product.status === 'flash-sale').slice(0, 5)
        const hotProduct    = product.filter(product => product.status === 'hot').slice(0, 5)
        const allProduct    = product.slice(0, 5)
        const allBrands = [...new Set(product.map(product => product.brand))]

        res.render('users/home', { title: 'Cửa hàng mỹ phẩm BunnyStore' , flashDealProduct, hotProduct, allProduct, allBrands }) })
      .catch(next)
  }
}

module.exports = new homeController