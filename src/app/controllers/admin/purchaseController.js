const product = require('../../models/productModel')
const purchase = require('../../models/purchaseModel')
const supplier = require('../../models/supplierModel')

class adminController {
  async allPurchases(req, res, next) {
    const index  = 'purchases'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage

    const [purchases, totalPurchase] = await Promise.all([
      purchase.find({deletedAt: null}).sort({ purchaseDate: -1 }).skip(skip).limit(itemsPerPage).lean(),
      purchase.find({deletedAt: null}).countDocuments()
    ])

    res.render('admin/all/purchase', { title: 'Danh sách phiếu nhập', layout: 'admin', index, successful, purchases, totalPurchase, currentPage })
  }

  async purchaseInfo(req, res, next) {
    const index  = 'purchases'
    const purchaseInfo = await purchase.findOne({ _id: req.params.id }).lean()
    const productId = purchaseInfo.products.map(product => product.id)
    const productInfo = await product.find({ _id: { $in: productId }, deletedAt: null }).lean()
    const productInfoWithQuantity = productInfo.map(product => {
      const quantity = purchaseInfo.products.find(p => p.id == product._id).quantity
      return { product: product, purchaseQuantity: quantity }
    })

    res.render('admin/detail/purchase', { title: 'Phiếu nhập', layout: 'admin', index, purchaseInfo, productInfoWithQuantity })
  }

  async purchaseUpdate(req, res, next) {

  }

  async purchaseCreate(req, res, next) {
    const index = 'purchases'
    const [products, suppliers] = await Promise.all([
      product.find({deletedAt: null}).lean(),
      supplier.find().lean()
    ])

    res.render('admin/create/purchase', { title: 'Thêm đơn nhập mới', layout: 'admin', index, products, suppliers })
  }

  async purchaseCreated(req, res, next) {
    let { 
      purchaseDate, 
      supplierId,
      note,
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
      supplierId: supplierId,
      note: note,
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