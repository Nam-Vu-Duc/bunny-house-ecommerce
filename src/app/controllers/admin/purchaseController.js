const product = require('../../models/productModel')
const purchase = require('../../models/purchaseModel')
const supplier = require('../../models/supplierModel')

class adminController {
  // all
  async getPurchases(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      purchase
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      purchase.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getFilter(req, res, next) {
  
  }

  async allPurchases(req, res, next) {
    res.render('admin/all/purchase', { title: 'Danh sách phiếu nhập', layout: 'admin' })
  }

  // update
  async getPurchase(req, res, next) {
    const purchaseInfo = await purchase.findOne({ _id: req.params.id }).lean()
    const supplierInfo = await supplier.findOne({ _id: purchaseInfo.supplierId }).lean()

    const productId = purchaseInfo.products.map(product => product.id)
    const productInfo = await product.find({ _id: { $in: productId }, deletedAt: null }).lean()
    const productInfoWithQuantity = productInfo.map(product => {
      const quantity = purchaseInfo.products.find(p => p.id == product._id).quantity
      return { product: product, purchaseQuantity: quantity }
    })
  }

  async purchaseInfo(req, res, next) {
    res.render('admin/detail/purchase', { title: 'Phiếu nhập', layout: 'admin' })
  }

  async purchaseUpdate(req, res, next) {

  }

  // create
  async getSuppliers(req, res, next) {
    const suppliers = await supplier.find().lean()
    return res.json({data: suppliers})
  }
  
  async getProducts(req, res, next) {
    const query = req.body.query
    const products = await product.find({
      name: { $regex: query, $options: 'i'}
    }).lean()
    return res.json({data: products})
  }
  
  async purchaseCreate(req, res, next) {
    res.render('admin/create/purchase', { title: 'Thêm đơn nhập mới', layout: 'admin' })
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
      totalProducts: productQuantity.reduce((acc, curr) => acc + parseInt(curr), 0),
      totalPurchasePrice: totalPurchasePrice
    });

    const productUpdates = []
    productId.forEach((id, index) => {
      productUpdates.push({ productId: id, quantity: productQuantity[index] })
    })
    
    await newPurchase.save()
    await supplier.updateOne({ _id: supplierId }, {
      $inc: { 
        totalCost: totalPurchasePrice,
        quantity: 1
       }
    })

    const bulkOps = productUpdates.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { quantity: quantity } }, 
        upsert: true,
      },
    }))
    await product.bulkWrite(bulkOps)

  }
}
module.exports = new adminController