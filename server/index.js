const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

// Store users as { socket.id: username }
const users = {};

app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Chat server is running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // ✅ User joins chat
  socket.on("joined", ({ user }) => {
    if (!user) return;

    users[socket.id] = user;

    // Welcome message to current user
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${user}`,
      id: "admin",
    });

    // Notify others
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${user} has joined the chat`,
      id: "admin",
    });
  });

  // ✅ User sends message
  socket.on("message", ({ message }) => {
    if (!message || message.trim() === "") return;

    io.emit("sendMessage", {
      user: users[socket.id],
      message: message,
      id: socket.id, // IMPORTANT for left/right UI
    });
  });

  // ✅ User disconnects
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      socket.broadcast.emit("leave", {
        user: "Admin",
        message: `${user} has left the chat`,
        id: "admin",
      });

      delete users[socket.id];
    }

    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
