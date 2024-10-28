const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const store = new Schema({
  name     : { type: String, default: '' },
  address  : { type: String, default: '' },
  details  : { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('store', store);
