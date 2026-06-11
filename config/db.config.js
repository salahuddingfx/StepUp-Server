const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_stepup');
    console.log('\x1b[32mDatabase connection synced\x1b[0m');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('Server is running, but database connection failed. Make sure MongoDB is active.');
    // Do not crash server in dev so that we can still test code.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
