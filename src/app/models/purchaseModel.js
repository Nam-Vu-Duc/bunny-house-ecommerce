const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const purchase = new Schema({
  products: [
    {
      id       : { type: String, default: '' },
      quantity : { type: Number, default: 0 },
    }
  ],
  supplierId          : { type: String, default: '' },
  purchaseDate        : { type: Date, default: '' },
  totalPurchasePrice  : { type: Number, default: 0 },
  note                : { type: String, default: '' },
}, { timestamps: true })
module.exports = mongoose.model('purchase', purchase);