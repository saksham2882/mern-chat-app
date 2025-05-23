import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import { app, server } from './socket/socket.js';
import userRoute from "./routes/user.route.js"
import messageRoute from "./routes/message.route.js"
import cookieParser from "cookie-parser"

connectDB()

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.static('public'));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);

server.listen(process.env.PORT, () => {
    console.log(`Server with Socket.IO listening at port ${PORT}...`);
});
