import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/send/:id").post(auth, sendMessage)
router.route("/:id").get(auth, getMessages)

export default router;  