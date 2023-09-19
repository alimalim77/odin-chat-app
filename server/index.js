const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-mufa.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
    //console.log(`User with ID ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  //Disconnect socket when React App refreshes
  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 3001; // Use the provided PORT environment variable by Render or default to 3001

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
