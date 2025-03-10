const supplier = require('../../models/supplierModel')
const purchase = require('../../models/purchaseModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class allSuppliersController {
  // all
  async getSuppliers(req, res, next) {
    try {
      const currentPage  = req.body.page
      const sort         = req.body.sort
      const filter       = req.body.filter
      const itemsPerPage = 10
      const skip         = (currentPage - 1) * itemsPerPage
  
      const [data, dataSize] = await Promise.all([
        supplier
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(itemsPerPage)
          .lean(),
        supplier.find(filter).countDocuments(),
      ]) 
      if (!data) res.status(404).json({data: [], data_size: 0})
      
      return res.json({data: data, data_size: dataSize})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async getFilter(req, res, next) {
  
  }

  async allSuppliers(req, res, next) {
    return res.render('admin/all/supplier', { title: 'Danh sách đối tác', layout: 'admin' })
  }

  // update
  async getSupplier(req, res, next) {
    try {
      const [supplierInfo, purchaseInfo] = await Promise.all([
        supplier.findOne({ _id: req.body.id }).lean(),
        purchase.find({ supplierId: req.body.id }).lean()
      ]) 
      if (!supplierInfo) return res.json({supplierInfo: null})
  
      return res.json({supplierInfo: supplierInfo, purchaseInfo: purchaseInfo})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async supplierInfo(req, res, next) {
    try {
      if (!checkForHexRegExp(req.params.id)) throw new Error('error')
      if (!(await supplier.findOne({ _id: req.params.id }).lean())) throw new Error('error')

      return res.render('admin/detail/supplier', { layout: 'admin' })

    } catch (error) {
      return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' }) 
    }
  }

  async supplierUpdate(req, res, next) {
    try {
      await supplier.updateOne({ _id: req.body.id }, {
        name    : req.body.name    ,
        phone   : req.body.phone   ,
        address : req.body.address ,
      })
  
      return res.json({isValid: true, message: 'Cập nhật thông tin thành công'})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  // create
  async supplierCreate(req, res, next) {
    return res.render('admin/create/supplier', { title: 'Thêm đối tác mới', layout: 'admin' })
  }

  async supplierCreated(req, res, next) {
    try {
      const userExist = await supplier.findOne({ phone: req.body.phone })
      if (userExist) return res.json({isValid: false, message: 'Sđt đã tồn tại'})
  
      const newSupplier = new supplier(req.body)
      await newSupplier.save()
      return res.json({isValid: true, message: 'Tạo tài khoản thành công'})
      
    } catch (error) {
      return res.json({error: error})
    }
  }
}
module.exports = new allSuppliersController