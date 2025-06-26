import { Server } from "socket.io";
import { Types } from "mongoose";

export const users = new Map();

export const activeChatUsers = new Map(); // Map to track active chat sessions

let io: Server; // Store io instance globally
const setupSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ["*", "http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("register", (userId) => {
      users.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on("activeChat", (data) => {
      // data contains { userId, activeChatPartnerId }
      if (data.activeChatPartnerId) {
        activeChatUsers.set(data.userId, data.activeChatPartnerId);
      } else {
        activeChatUsers.delete(data.userId);
      }
    });

    socket.on("disconnect", () => {
      users.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          users.delete(userId);
          activeChatUsers.delete(userId); // Remove user from active chat users
        }
      });
    });
  });

  return io;
};

export { setupSocket, io };
