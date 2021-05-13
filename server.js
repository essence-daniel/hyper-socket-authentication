require("dotenv").config();

const { Server } = require("socket.io");
const express = require("express");
const helmet = require("helmet");
const http = require("http");

// Create socket.io server
const app = express();
app.use(helmet());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

// Authentication middleware
const authenticate = require("./middleware/authenticate");
const socketAuthenticate = require("./middleware/socketAuthenticate");

// 404 Route
const _404Route = require("./routes/404");

// Handle for socket connection
io.on("connection", async (socket) => {
  // Checks if already connected
  let token = socket.handshake.auth.token;
  if (io.sockets.adapter.rooms.get(token)) {
    socket.send({ status: 409, message: "Active on another device" });
    socket.disconnect();
    return;
  }

  // Authenticates user
  await socketAuthenticate(socket);
  if (socket.disconnected) return;

  socket.send({ status: 200, message: "Logged in" });

  // Creates room with the name of the license key
  socket.join(["active", socket.handshake.auth.token]);
});

// For specified users to see the number of active users
app.get("/active-users", authenticate, (req, res) => {
  var userCount = io.sockets.adapter.rooms.get("active")?.size || 0;
  res.send({ activeUsers: userCount });
});

// 404 for any unspecified route
app.use(_404Route);

// Listen on port
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
