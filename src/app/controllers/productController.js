const product = require('../models/productModel')

class productController {
  async show(req, res, next) {
    const newProduct = await product.findOne({ slug: req.params.slug }).lean()
    let newProductType = ''
    let relatedProducts 

    if (newProduct.skincare !== '') {
      newProductType = newProduct.skincare
      relatedProducts = await product.find({ skincare: newProductType }).lean().limit(5)
    } else if (newProduct.makeup !== '') {
      newProductType = newProduct.makeup
      relatedProducts = await product.find({ makeup: newProductType }).lean().limit(5)
    }

    relatedProducts = relatedProducts.filter(product => product._id.toString() !== newProduct._id.toString())

    newProduct.oldPrice = newProduct.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    newProduct.price = newProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    relatedProducts.forEach(product => {
      product.oldPrice = product.oldPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    })

    res.render('users/product', { title: newProduct.name , newProduct, relatedProducts, newProductType })
  }
}

module.exports = new productController