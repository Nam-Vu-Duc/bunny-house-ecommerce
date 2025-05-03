const product = require('../../models/productModel')
const purchase = require('../../models/purchaseModel')
const supplier = require('../../models/supplierModel')
const store = require('../../models/storeModel')
const employee = require('../../models/employeeModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class adminController {
  // all
  async getPurchases(req, res, next) {
    try {
      const currentPage  = req.body.page
      const sort         = req.body.sort
      const filter       = req.body.filter
      const uid          = req.body.uid 
      const itemsPerPage = 10
      const skip         = (currentPage - 1) * itemsPerPage

      const userInfo = await employee.findOne({ _id: uid }).lean()
      if (!userInfo) throw new Error('User not found')
      if (userInfo.role !== 'admin') filter.storeCode = userInfo.storeCode

      console.log(userInfo)
  
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
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async getFilter(req, res, next) {
    try {
      const stores = await store.find().lean()
  
      return res.json({ store: stores })
    } catch (error) {
      return res.json({error: error})
    }
  }

  async allPurchases(req, res, next) {
    return res.render('admin/all/purchase', { title: 'Danh sách phiếu nhập', layout: 'admin' })
  }

  // update
  async getPurchase(req, res, next) {
    try {
      const purchaseInfo = await purchase.findOne({ _id: req.body.id }).lean()
      if (!purchaseInfo) return res.json({purchaseInfo: null})
  
      const supplierInfo = await supplier.findOne({ _id: purchaseInfo.supplierId}).lean()
      
      return res.json({purchaseInfo: purchaseInfo, supplierInfo: supplierInfo})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async purchaseInfo(req, res, next) {
    try {
      if (!checkForHexRegExp(req.params.id)) throw new Error('error')
      if (!(await purchase.findOne({ _id: req.params.id }).lean())) throw new Error('error')

      return res.render('admin/detail/purchase', { layout: 'admin' })

    } catch (error) {
      return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' }) 
    }
  }

  async purchaseUpdate(req, res, next) {

  }

  // create
  async getSuppliers(req, res, next) {
    const suppliers = await supplier.find().lean()
    return res.json({data: suppliers})
  }
  
  async getStores(req, res, next) {
    const stores = await store.find().lean()
    return res.json({data: stores})
  }
  
  async getProducts(req, res, next) {
    const query = req.body.query
    const products = await product.find({
      deletedAt: null,
      name: { $regex: query, $options: 'i'}
    }).lean()
    return res.json({data: products})
  }
  
  async purchaseCreate(req, res, next) {
    return res.render('admin/create/purchase', { title: 'Thêm đơn nhập mới', layout: 'admin' })
  }

  async purchaseCreated(req, res, next) {
    try {
      let { 
        purchaseDate, 
        supplierId,
        storeCode,
        note,
        productId, 
        productName,
        productImg,
        productPrice,
        productQuantity,
        totalPurchasePrice
      } = req.body
  
      // if the req.body has only 1 record, convert 1 record to array
      if(!Array.isArray(productId)) {
        productId       = [productId]
        productName     = [productName]
        productImg      = [productImg]
        productPrice    = [productPrice]
        productQuantity = [productQuantity]
      }
  
      const newPurchase = new purchase({
        products: productId.map((product, index) => ({
          id        : productId[index],
          name      : productName[index],
          image     : productImg[index],
          price     : productPrice[index],
          quantity  : productQuantity[index], 
          totalPrice: productPrice[index] * productQuantity[index]
        })),
        supplierId: supplierId,
        storeCode: storeCode,
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
      return res.json({isValid: true, message: 'Tạo đơn nhập mới thành công'})
      
    } catch (error) {
      return res.json({error: error})
    }
  }
}
module.exports = new adminController