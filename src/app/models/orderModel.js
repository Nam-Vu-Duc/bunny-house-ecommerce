const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const Schema = mongoose.Schema
const order = new Schema({
  products: [
    {
      id          : { type: String, default: '' },
      name        : { type: String, default: '' },
      price       : { type: Number, default: 0 },
      quantity    : { type: Number, default: 0 },
      totalPrice  : { type: Number, default: 0 }
    }
  ],
  customerInfo: {
    userId        : { type: String, default: '' },
    name          : { type: String, default: '' },
    phone         : { type: String, default: '' },
    address       : { type: String, default: '' },
    note          : { type: String, default: '' }
  },
  totalOrderPrice : { type: Number, default: 0 },
  paymentMethod   : { type: String, default: '' },
  status          : { type: String, default: 'preparing' },
  isRated         : { type: Boolean, default: false},
  storeId         : { type: String, default: '671600cc147dd8bae142bbb5' },
  deletedAt       : { type: Date, default: null }
}, { timestamps: true })
module.exports = mongoose.model('order', order)