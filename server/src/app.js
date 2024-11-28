import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const users = new Map();

io.on("connection", (socket) => {
  socket.on("user:join", (userData) => {
    users.set(userData.userId, { username: userData.username, online: true });
    io.emit("user:online", Array.from(users.values()));
  });

  socket.on("logout", (userId) => {
    if (users.has(userId)) {
      users.delete(userId);
      io.emit("user:online", Array.from(users.values()));
    }
  });

  socket.on("message:send", (messageData) => {
    try {
      const { sender, message, media, clientMessageId, username } = messageData;
      const constructedMessage = {
        sender,
        username,
        message,
        media,
        clientMessageId,
        timestamp: new Date(),
      };
      io.emit("message:receive", constructedMessage);
    } catch (error) {
      console.error("Error in message:send handler:", error);
    }
  });

  socket.on("typing:started", (data) => {
    const { username } = data;
    socket.broadcast.emit("typing:started", { username });
  });

  socket.on("typing:stopped", () => {
    socket.broadcast.emit("typing:stopped");
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("user:online", Array.from(users.values()));
  });
});

export { httpServer as app, port };
