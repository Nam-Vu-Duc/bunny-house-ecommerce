const product = require('../models/productModel')
const user = require('../models/userModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => {
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const flashDealProduct = product.filter(product => product.hotsale === 'flash-sale').slice(0, 5)
        const hotProduct = product.filter(product => product.hotsale === 'hot').slice(0, 5)
        const allProduct = product.slice(0, 5)
        const allBrands = [...new Set(product.map(product => product.brand))]
        res.render('users/home', { title: 'Cửa hàng mỹ phẩm BunnyStore' , flashDealProduct, hotProduct, allProduct, allBrands }) })
      .catch(next)
  }

  showUser(req, res, next) {
    user.findOne({ _id: req.params._id }).lean()
      .then( user => {
        res.render('users/home', user) 
      })
      .catch(next)
  }
}

module.exports = new homeController