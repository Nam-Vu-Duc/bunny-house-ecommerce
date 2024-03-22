require('dotenv').config()
const mongoose = require('mongoose')

const connect = async () => {
  try {
    const mongodb = process.env.MONGDO_DB
    await mongoose.connect(mongodb);
    console.log('connect successfully')
  } catch (error) {
    console.log('connect failed')
  }
}

module.exports = { connect }