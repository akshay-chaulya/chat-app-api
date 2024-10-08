import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import { origins } from "../config";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: origins,
        methods: ["GET", "POST"],
    }
})

export const getReceiverSocketId = (receiverId: string) => {
    console.log(userSocketMap)
    return userSocketMap[receiverId];
}

const userSocketMap: { [key: string]: string } = {} // {userId: socketId}

io.on("connection", (socket) => {
    // console.log("a user connected socket id: ", socket.id);

    const userId = socket.handshake.query.userId as string;
    // console.log("a user connected userId: ", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        // console.log("user disconnect", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { app, io, server };