const product = require('../models/productModel')
const brand = require('../models/brandModel')

class homeController {
  async show(req, res, next) {
    const [products, brands] = await Promise.all([
      product.find({ deletedAt: null }).lean(),
      brand.find({}).lean(),
    ]);

    const categorizedProducts = products.reduce(
      (acc, item) => {
        if (acc.flashDealProduct.length < 5 && item.status === 'flash-sale') acc.flashDealProduct.push(item)
        if (acc.hotProduct.length < 5 && item.status === 'hot') acc.hotProduct.push(item)
        if (acc.allProduct.length < 5) acc.allProduct.push(item)
        return acc
      },
      { flashDealProduct: [], hotProduct: [], allProduct: [] }
    );

    res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng', ...categorizedProducts, brands });
  }
}
module.exports = new homeController