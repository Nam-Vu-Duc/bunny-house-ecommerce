class productController {
  // get /product
  index(req, res) {
    res.render('products')
  }
}

module.exports = new productController