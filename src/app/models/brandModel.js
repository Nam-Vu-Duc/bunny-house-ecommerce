const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const Schema = mongoose.Schema

const model = new Schema({
  name         : { type: String }, 
  img          : { 
    path       : String,
    filename   : String,
  }, 
  totalProduct : { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('model', model);
