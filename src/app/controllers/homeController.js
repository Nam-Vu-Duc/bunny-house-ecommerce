const product = require('../models/productModel')
const brand = require('../models/brandModel')

class homeController {
  async show(req, res, next) {
    const products = await product.find({ deletedAt: null }).lean()
    const brands = await brand.find({}).lean()
    
    const { flashDealProduct, hotProduct, allProduct } = products.reduce(
      (acc, item, index) => {
          if (item.status === 'flash-sale' && acc.flashDealProduct.length < 5) {
              acc.flashDealProduct.push(item);
          }
          if (item.status === 'hot' && acc.hotProduct.length < 5) {
              acc.hotProduct.push(item);
          }
          if (acc.allProduct.length < 5) {
              acc.allProduct.push(item);
          }
          return acc;
      },
      { flashDealProduct: [], hotProduct: [], allProduct: [] }
    );

    res.render('users/home', { title: 'Cửa hàng mỹ phẩm BunnyStore' , flashDealProduct, hotProduct, allProduct, brands })

  }
}

module.exports = new homeController