const mongoose = require('mongoose')


/**
 * Connects to the MongoDB database using Mongoose.
 *
 * @param {string} url - The MongoDB connection string.
 */
const connectDB = async (url) => {
  await mongoose.connect(url);
};


module.exports = connectDB;