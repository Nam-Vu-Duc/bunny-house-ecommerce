const product = require('../models/productModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => {
        const flashDealProduct    = product.filter(product => product.status === 'flash-sale').slice(0, 5)
        flashDealProduct.price    = flashDealProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        flashDealProduct.oldPrice = flashDealProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        
        const hotProduct    = product.filter(product => product.status === 'hot').slice(0, 5)
        hotProduct.price    = hotProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        hotProduct.oldPrice = hotProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        
        const allProduct    = product.slice(0, 5)
        allProduct.price    = allProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        allProduct.oldPrice = allProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

        const allBrands = [...new Set(product.map(product => product.brand))]

        res.render('users/home', { title: 'Cửa hàng mỹ phẩm BunnyStore' , flashDealProduct, hotProduct, allProduct, allBrands }) })
      .catch(next)
  }
}

module.exports = new homeController