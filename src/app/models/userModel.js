const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const user = new Schema({
  loginInfo : {
    email    : { type: String, unique: true },
    password : { type: String, default: ''},
    role     : { type: String, default: 'user' },
  },
  userInfo  : {
    name     : { type: String, default: '' },
    phone    : { type: String, default: '' },
    gender   : { type: String, default: '' },
    address  : { type: String, default: '' }
  },
  revenue   : { type: Number, default: 0 },
  slug      : { type: String, slug: 'userInfo.name', unique: true },
}, { timestamps: true })
module.exports = mongoose.model('user', user);