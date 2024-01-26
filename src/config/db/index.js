const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/bunnyStore-database');
    console.log('connect successfully')
  } catch (error) {
    console.log('connect failed')
  }
}

module.exports = { connect }