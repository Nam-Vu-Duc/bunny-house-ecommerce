const product = require('../../models/productModel')

class adminController {
  async allPurchases(req, res, next) {
    const index  = 'purchases'

    res.render('admin/allPurchases', { title: 'Danh sách phiếu nhập', layout: 'admin', index })
  }

  async purchaseInfo(req, res, next) {
    const index  = 'purchases'

    res.render('admin/purchase', { title: 'Phiếu nhập', layout: 'admin', index })
  }
}
module.exports = new adminController