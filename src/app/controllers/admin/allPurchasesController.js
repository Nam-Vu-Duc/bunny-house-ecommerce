const product = require('../../models/productModel')

class adminController {
  async allPurchases(req, res, next) {
    const index  = 'purchases'

    res.render('admin/allPurchases', { title: 'Danh sách phiếu nhập', layout: 'admin', index })
  }

  async purchaseInfo(req, res, next) {
    const index  = 'purchases'

    res.render('admin/detailPurchase', { title: 'Phiếu nhập', layout: 'admin', index })
  }

  async purchaseUpdate(req, res, next) {

  }

  async purchaseCreate(req, res, next) {

  }

  async purchaseCreated(req, res, next) {

  }
}
module.exports = new adminController