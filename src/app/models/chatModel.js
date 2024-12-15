const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const chat = new Schema({
  adminId  : { type: String }, 
  userId   : { type: String }, 
}, { timestamps: true })
module.exports = mongoose.model('chat', chat);