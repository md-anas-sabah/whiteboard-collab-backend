require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Session, sequelize } = require("./models");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log(`Client connected to room ${roomId}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room ${roomId}`);
  });

  socket.on("draw", (data) => {
    socket.to(data.roomId).emit("draw", data);
  });

  socket.on("save_session", async ({ roomId, sessionName, imageData }) => {
    try {
      await Session.upsert({
        roomId,
        sessionName,
        imageData,
      });
      socket.emit("save_success");
    } catch (error) {
      console.error("Error saving session:", error);
      socket.emit("save_error");
    }
  });

  // socket.on("load_session", async ({ roomId, sessionName }) => {
  //   try {
  //     const session = await Session.findOne({
  //       where: { roomId, sessionName },
  //     });

  //     if (session) {
  //       socket.emit("load_session", session.imageData);
  //     }
  //   } catch (error) {
  //     console.error("Error loading session:", error);
  //     socket.emit("load_error");
  //   }
  // });
  socket.on("load_session", async ({ roomId, sessionName }) => {
    try {
      const session = await Session.findOne({
        where: { roomId, sessionName },
      });

      if (session) {
        console.log("Session found:", session);
        socket.emit("load_session", session.imageData);
      } else {
        console.log("No session found");
        socket.emit("load_error", "Session not found");
      }
    } catch (error) {
      console.error("Error loading session:", error);
      socket.emit("load_error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected from room ${roomId}`);
    socket.leave(roomId);
  });
});

// API Routes
app.get("/api/sessions/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const sessions = await Session.findAll({
      where: { roomId },
      attributes: ["sessionName", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Database connection and server start
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();

// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("config", "config.json"),
  "models-path": path.resolve("models"),
  "migrations-path": path.resolve("migrations"),
};
