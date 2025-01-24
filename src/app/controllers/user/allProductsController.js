const product = require('../../models/productModel')
const comment = require('../../models/commentModel')

class allProductsController {
  async showAllProducts(req, res, next) {
    const isUser = req.isUser === true ? true : false

    const currentPage  = req.query.page   || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    product.find({ deletedAt: null }).lean()
      .then(products => { 
        let title = 'Toàn Bộ Sản Phẩm'
        const filters = {
          'flash-sale' : { filter: product => product.status     === 'flash-sale', title: 'Sản Phẩm Đang Flash Sale' },
          'hot'        : { filter: product => product.status     === 'hot'       , title: 'Sản Phẩm Đang Hot'        },
          'new-arrival': { filter: product => product.newArrival === 'yes'       , title: 'Sản Phẩm Mới Về'          },
          'skincare'   : { filter: product => product.skincare   !== ''          , title: 'Sản Phẩm Skincare'        },
          'makeup'     : { filter: product => product.makeup     !== ''          , title: 'Sản Phẩm Makeup'          }
        }
        const sortFields = [
          'price',
          'rate',
          'saleNumber'
        ]

        if (type in filters) {
          products = products.filter(filters[type].filter)
          title = filters[type].title
        }
        sortFields.forEach((field) => {
          if (sortedList[field]) {
            console.log(field, sortedList[field])
            products = products.sort((a, b) => {
              if (sortedList[field] === 'asc') return a[field] - b[field] 
              if (sortedList[field] === 'desc') return b[field] - a[field]
            })
          }
        })

        const productLength = products.length
        products = products.slice(skip, skip + itemsPerPage)
        
        res.render('users/allProducts', { title: title, isUser, products, type, productLength, currentPage }) })
      .catch(next)
  }

  async showAllSkincare(req, res, next) {
    const isUser = req.isUser === true ? true : false

    const type = req.params.slug
    const products = await product.find({ deletedAt: null, skincare: type }).lean()

    res.render('users/allProducts', { title: 'Dòng Skincare', products, type, isUser })
  }

  async showAllMakeUp(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const type = req.params.slug
    const products = await product.find({ deletedAt: null, makeup: type }).lean()
  
    res.render('users/allProducts', { title: 'Dòng Makeup', products, type, isUser }) 
  }

  async productInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    
    const newProduct = await product.findOne({ _id: req.params.id }).lean()
    if (!newProduct) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
    const comments = await comment.find({ productId: newProduct._id }).lean()
    let newProductType = ''
    let relatedProducts 

    if (newProduct.skincare !== '') {
      newProductType = newProduct.skincare
      relatedProducts = await product.find({ skincare: newProductType }).lean().limit(5)
    } else {
      newProductType = newProduct.makeup
      relatedProducts = await product.find({ makeup: newProductType }).lean().limit(5)
    }
    relatedProducts = relatedProducts.filter(product => product._id.toString() !== newProduct._id.toString())
    res.render('users/detailProduct', { title: newProduct.name , isUser, newProduct, relatedProducts, newProductType, comments })
  }
}
module.exports = new allProductsController