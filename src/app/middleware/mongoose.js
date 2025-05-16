const mongoose = require('mongoose');

const MONGO_DB = process.env.MONGO_DB
if (!MONGO_DB) throw new Error('Please define the MONGO_DB environment variable');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('[dbConnect]: Using existing database connection');
    return cached.conn;
  }

   if (!cached.promise) {
    console.log('[dbConnect]: Creating new database connection');
    cached.promise = mongoose.connect(MONGO_DB, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise
  return cached.conn
}

module.exports = dbConnect