const supplier = require('../../models/supplierModel')
const purchase = require('../../models/purchaseModel')

class allSuppliersController {
  // all
  async getSuppliers(req, res, next) {
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
  }

  async getFilter(req, res, next) {
  
  }

  async allSuppliers(req, res, next) {
    res.render('admin/all/supplier', { title: 'Danh sách đối tác', layout: 'admin' })
  }

  // update
  async getSupplier(req, res, next) {
    const supplierInfo = await supplier.findOne({ _id: req.body.id }).lean()
    if (!supplierInfo) return res.json({supplierInfo: null})

    const purchaseInfo = await purchase.find({ 'supplierId': req.body.id }).lean()

    return res.json({supplierInfo: supplierInfo, purchaseInfo: purchaseInfo})
  }

  async supplierInfo(req, res, next) {
    res.render('admin/detail/supplier', { layout: 'admin' })
  }

  async supplierUpdate(req, res, next) {
    const {
      name,
      email,
      phone,
      address
    } = req.body

    await supplier.updateOne({ _id: req.params.id }, {
      name    : name    ,
      phone   : phone   ,
      email   : email   ,
      address : address ,
    })
  }

  // create
  async supplierCreate(req, res, next) {
    res.render('admin/create/supplier', { title: 'Thêm đối tác mới', layout: 'admin' })
  }

  async supplierCreated(req, res, next) {
    const userExist = await supplier.findOne({ phone: req.body.phone })
    if (userExist) return res.json({isValid: false, message: 'Sđt đã tồn tại'})

    const newSupplier = new supplier(req.body)
    await newSupplier.save()
    return res.json({isValid: true, message: 'Tạo tài khoản thành công'})
  }
}
module.exports = new allSuppliersController