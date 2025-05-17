import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "No token provided", success: false });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.id = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', success: false });
    }
}

export default auth;