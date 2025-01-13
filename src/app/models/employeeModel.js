const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const Schema = mongoose.Schema
const employee = new Schema({
  loginInfo : {
    email    : { type: String, unique: true },
    password : { type: String, default: ''},
    role     : { type: String, default: 'employee' },
  },
  userInfo  : {
    name     : { type: String, default: '' },
    phone    : { type: String, default: '' },
    gender   : { type: String, default: '' },
    address  : { type: String, default: '' },
    storeId  : { type: String, default: '' }
  },
  slug      : { type: String, slug: 'userInfo.name', unique: true },
}, { timestamps: true })
module.exports = mongoose.model('employee', employee);