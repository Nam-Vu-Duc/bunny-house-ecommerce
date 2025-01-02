const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const comment = new Schema({
  productId : { type: String },
  senderId : { type: String },
  content  : { type: String },
}, { timestamps: true })
module.exports = mongoose.model('comment', comment);