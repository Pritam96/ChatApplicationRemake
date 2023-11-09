const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Loading environment variables
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Routes files
const auth = require('./routes/auth');

const app = express();

app.use(express.json());

// Mount routes
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  )
);
