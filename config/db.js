const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to the database. Error: ${error.message}`);

    // Exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;
