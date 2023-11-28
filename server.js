// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const ErrorResponse = require("./utils/errorResponse");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to the database
connectDB();

// Routes files
const auth = require("./routes/auth");
const users = require("./routes/users");
const chats = require("./routes/chats");
const messages = require("./routes/messages");

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/chats", chats);
app.use("/api/v1/messages", messages);

// Serve static files from the src directory
app.use(express.static("./src"));

// Catch-all route for handling wrong URLs
app.all("*", (req, res, next) => {
  return next(new ErrorResponse(`Invalid URL - ${req.originalUrl}`, 404));
});

// Error handler middleware
app.use(errorHandler);

// Serve index.html for the root URL
app.get("/", (req, res, next) => res.sendFile("index.html"));

// Define the port for the Express server
const PORT = process.env.PORT || 5000;

// Start the Express server
const server = app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  )
);

// Socket.io setup
const io = new Server(server, {
  pingTimeout: 60000, // Set ping timeout to 60 seconds
  cors: { origin: `http://localhost:${PORT}` }, // Configure CORS
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  let userInfo;
  // Setup event - receives user parameter from client
  socket.on("setup", (user) => {
    userInfo = user;
    // Create a new room using the current user_id
    socket.join(userInfo._id);
    socket.emit("connected");
  });

  // joinChat event - receives room parameter from client
  socket.on("joinChat", (room) => {
    // When a chat is clicked, create a new chat room
    socket.join(room);
    console.log(`${userInfo.name} joined a room: ${room}`);
  });

  // newMessage event - receives new message from client and distributes accordingly
  socket.on("newMessage", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.members) return console.log("chat users not found");

    // Emit message to each user in the chat except the sender
    chat.members.forEach((user) => {
      if (user._id.toString() !== newMessage.sender._id.toString()) {
        // Emit message for this user id room
        socket.in(user._id).emit("messageReceived", newMessage);
      }
    });
  });

  // Handle disconnection
  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userInfo._id);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Note: server.close() is commented out to prevent closing the server and exiting the process
  // server.close(() => process.exit(1));
});
