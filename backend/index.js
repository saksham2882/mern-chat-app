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

const allowedOrigins = [
    process.env.CLIENT_URL, "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.static('public'));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);

server.listen(process.env.PORT, () => {
    console.log(`Server with Socket.IO listening at port ${PORT}...`);
});
