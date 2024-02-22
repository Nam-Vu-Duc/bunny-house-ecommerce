const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const Schema = mongoose.Schema

const user = new Schema({
  name: { type: String, },
  // avatar: { type: String, },
  email: { type: String, unique: true},
  password: { type: String, },
  role: { type: String, default: 'user' },
  slug: { type: String, slug: 'name', unique: true },
}, { timestamps: true })

module.exports = mongoose.model('user', user);
