const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const message = new Schema({
  chatId   : { type: String }, 
  senderId : { type: String }, 
  content  : { type: String }, 
}, { timestamps: true })
module.exports = mongoose.model('message', message);