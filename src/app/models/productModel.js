const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug)

const Schema = mongoose.Schema

const product = new Schema({
  brand: { type: String, },
  name: { type: String, },
  price: { type: Number, },
  description: { type: String, },
  details: { type: String, },
  flashsale: { type: Boolean, },
  hotsale: { type: Boolean },
  category: { type: String }, 
  image: { type: String, },
  slug: { type: String, slug: 'name' }
}, { timestamps: true })

module.exports = mongoose.model('product', product);