const store = require('../../models/storeModel')
const employee = require('../../models/employeeModel')

class allStoresController {
  // all
  async getStores(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      store
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      store.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getFilter(req, res, next) {
  
  }

  async allStores(req, res, next) {
    res.render('admin/all/store', { title: 'Danh sách cửa hàng', layout: 'admin' })
  }

  // update
  async getStore(req, res, next) {
    const [storeInfo, employeesInfo] = await Promise.all([
      store.findOne({ _id: req.body.id }).lean(),
      employee.find({ 'userInfo.storeId': req.body.id }).lean(),
    ])
    if (!storeInfo) return res.json({storeInfo: null})

    return res.json({storeInfo: storeInfo, employeesInfo: employeesInfo})
  }

  async storeInfo(req, res, next) {
    res.render('admin/detail/store', { layout: 'admin' })
  }

  async storeUpdate(req, res, next) {
    const {
      name,
      address,
      details
    } = req.body

    await store.updateOne({ _id: req.params.id }, {
      name   : name,
      address: address,
      details: details
    })
  }

  // create
  async storeCreate(req, res, next) {
    res.render('admin/create/store', { title: 'Thêm cửa hàng mới', layout: 'admin' })
  }

  async storeCreated(req, res, next) {
    const newStore = new store(req.body)

    await newStore.save()
    return res.json({isValid: true, message: 'Tạo cửa hàng thành công'})
  }
}
module.exports = new allStoresController