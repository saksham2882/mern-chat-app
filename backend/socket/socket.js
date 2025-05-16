import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
    process.env.CLIENT_URL, "http://localhost:5173",
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
}

const userSocketMap = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId !== undefined) {
        userSocketMap.set(userId, socket.id);
    }

    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    socket.on('disconnect', () => {
        userSocketMap.delete(userId);
        io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    });
})

export { app, server, io };