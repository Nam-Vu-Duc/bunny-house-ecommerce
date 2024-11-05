const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const product = new Schema({
  categories   : { type: String }, 
  skincare     : { type: String }, 
  makeup       : { type: String }, 
  brand        : { type: String },
  name         : { type: String },
  oldPrice     : { type: Number, default: ''  },  
  price        : { type: Number },
  quantity     : { type: Number },
  guide        : { type: String },
  description  : { type: String },
  details      : { type: String },
  status       : { type: String, default: 'no' },
  newArrival   : { type: String, default: 'no' },
  rate         : { type: Number },
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
