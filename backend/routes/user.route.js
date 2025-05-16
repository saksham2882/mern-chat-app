import express from 'express';
import { getOtherUsers, login, logout, register, updateUser } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const username = req.body.username || 'unknown';
        const extension = path.extname(file.originalname);
        cb(null, `${username}${extension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG/JPG/PNG images are allowed!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/').get(auth, getOtherUsers);
router.route('/update').put(auth, upload.single('profilePhoto'), updateUser);

export default router;