const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const product = new Schema({
  categories   : { type: String, default: '' }, 
  skincare     : { type: String, default: '' }, 
  makeup       : { type: String, default: '' }, 
  brand        : { type: String, default: '' },
  name         : { type: String, default: '' },
  purchasePrice: { type: Number, default: 0 },
  oldPrice     : { type: Number, default: 0 },  
  price        : { type: Number, default: 0 },
  quantity     : { type: Number, default: 0 },
  guide        : { type: String, default: '' },
  description  : { type: String, default: '' },
  details      : { type: String, default: '' },
  status       : { type: String, default: 'no' },
  newArrival   : { type: String, default: 'no' },
  rate         : { type: Number, default: 0 },
  img          : { 
    path       : String,
    filename   : String,
  },
  slug         : { type: String, slug: 'name', unique: true },
  deletedAt    : {type: Date, default: null }
}, { timestamps: true })

product.query.sortable = function (req) {
  if (req.query.hasOwnProperty('_sort')) {
    const isValidType = ['asc', 'desc'].includes(req.query.type)
    
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : 'desc'
    })
  }
  return this
}
module.exports = mongoose.model('product', product);