const product = require('../../models/productModel')
const purchase = require('../../models/purchaseModel')

class adminController {
  async allPurchases(req, res, next) {
    const index  = 'purchases'
    const successful = req.flash('successful')
    const purchases = await purchase.find({deletedAt: null}).lean()
    const totalPurchase = purchases.length
    res.render('admin/all/purchase', { title: 'Danh sách phiếu nhập', layout: 'admin', index, purchases, successful, totalPurchase })
  }

  async purchaseInfo(req, res, next) {
    const index  = 'purchases'
    res.render('admin/detail/purchase', { title: 'Phiếu nhập', layout: 'admin', index })
  }

  async purchaseUpdate(req, res, next) {

  }

  async purchaseCreate(req, res, next) {
    const index = 'purchases'
    const products = await product.find({deletedAt: null}).lean()
    res.render('admin/create/purchase', { title: 'Thêm đơn nhập mới', layout: 'admin', index, products })
  }

  async purchaseCreated(req, res, next) {
    let { 
      purchaseDate, 
      productId, 
      productQuantity,
      totalPurchasePrice
    } = req.body

    // if the req.body has only 1 record, convert 1 record to array
    if(!Array.isArray(productId)) {
      productId       = [productId]
      productQuantity = [productQuantity]
    }

    const newPurchase = new purchase({
      products: productId.map((product, index) => ({
        id        : productId[index],
        quantity  : productQuantity[index],
      })),
      purchaseDate: purchaseDate,
      totalPurchasePrice: totalPurchasePrice
    });

    const productUpdates = []
    productId.forEach((id, index) => {
      productUpdates.push({ productId: id, quantity: productQuantity[index] })
    })

    const bulkOps = productUpdates.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId }, // Find product by ID
        update: { $inc: { quantity: quantity } }, // Increment quantity
        upsert: true, // Create product if it doesn't exist
      },
    }));
    await newPurchase.save()
    await product.bulkWrite(bulkOps);
    req.flash('successful', 'purchase successfully')
    return res.redirect('/admin/all-purchases')
  }
}
module.exports = new adminController