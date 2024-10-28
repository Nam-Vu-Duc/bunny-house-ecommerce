const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const order = new Schema({
  products: [
    {
      name          : String,
      price         : Number,
      quantity      : Number,
      totalPrice    : Number
    }
  ],
  customerInfo: {
    userId          : String,
    name            : String,
    phone           : String,
    address         : String,
    note            : String
  },
  totalOrderPrice   : Number,
  paymentMethod     : String,
  status            : { type: String, default: 'preparing' },
  deletedAt         : {type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('order', order);
