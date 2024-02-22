const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const Schema = mongoose.Schema

const order = new Schema({
  productName: { type: String, },
  price: { type: Number, },
  quantity: { type: Number, },
  totalPrice: { type: Number, },
  delivery: { type: String, },
  userName: { type: String, },
  phoneNumber: { type: String, },
  note: { type: String, },
  slug: { type: String, slug: '', unique: true },
  deletedAt: {type: Date, default: null }
}, { timestamps: true })


module.exports = mongoose.model('order', order);
