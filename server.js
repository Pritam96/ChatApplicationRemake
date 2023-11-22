const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const ErrorResponse = require("./utils/errorResponse");
const errorHandler = require("./middleware/error");

// Loading environment variables
dotenv.config({ path: "./config/config.env" });

// connect to the database
connectDB();

// Routes files
const auth = require("./routes/auth");
const users = require("./routes/users");
const chats = require("./routes/chats");
const messages = require("./routes/messages");

const app = express();

app.use(express.json());
app.use(cors());

// Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/chats", chats);
app.use("/api/v1/messages", messages);

// Serve static files
app.use(express.static("./src"));

// Catch-all route for handling wrong URLs
app.all("*", (req, res, next) => {
  return next(new ErrorResponse(`Invalid URL - ${req.originalUrl}`, 404));
});

// Error handler middleware
app.use(errorHandler);

// Define a route to handle the root URL and serve index.html
app.get("/", (req, res, next) => res.sendFile("index.html"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
