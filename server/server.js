import express from "express";
import http from "http";
import { Server } from "socket.io";
import process from "process";
import ACTIONS from "./Actions.js";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Socket.IO server!" });
});

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId]?.username,
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = { roomId, username };
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });
  
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  socket.on("disconnect", () => {
    const { roomId, username } = userSocketMap[socket.id] || {};
    delete userSocketMap[socket.id];

    if (roomId) {
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username,
        });
      });
    }
  });
});

const PORT = process.env.PORT || 6969;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
