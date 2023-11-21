const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Loading environment variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

// Routes files
const auth = require("./routes/auth");
const users = require("./routes/users");
const chats = require("./routes/chats");

const app = express();

app.use(express.json());

app.use(cors());

app.use(errorHandler);

// Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/chats", chats);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  )
);
