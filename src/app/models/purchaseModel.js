const { id } = require('date-fns/locale');
const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const purchase = new Schema({
  products: [
    {
      id        : String,
      quantity  : Number,
    }
  ],
  purchaseDate  : Date,
  totalPurchasePrice : Number,
}, { timestamps: true })
module.exports = mongoose.model('purchase', purchase);