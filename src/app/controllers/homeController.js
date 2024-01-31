const product = require('../models/productModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const flashDealProduct = product.filter(product => product.hotsale === 'flash-sale').slice(0, 5)
        const hotProduct = product.filter(product => product.hotsale === 'hot').slice(0, 5)
        const allProduct = product
        res.render('users/home', { title: 'Cửa hàng mỹ phẩm BunnyStore' , flashDealProduct, hotProduct, allProduct }) })
      .catch(next)
  }

  navigate(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const categories = product.filter(product => product.price === 100000)
        const nestedCategories = product.filter(product => product.price === 200000)
        res.render('partials/userNavigate', { categories, nestedCategories } )})
      .catch(next)
  }
}

module.exports = new homeController