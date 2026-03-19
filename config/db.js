const mongoose = require('mongoose');

const dbUrl = process.env.DB_URI;

// Suppress strictQuery deprecation warning and align behavior with Mongoose 7 default
mongoose.set('strictQuery', false);

if (!dbUrl || typeof dbUrl !== 'string' || dbUrl.trim() === '') {
  throw new Error('Environment variable DB_URI is missing or empty. Set DB_URI in your .env file.');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;