import { Router } from "express";
import { 
    sendMessage,
    getMessages,
} from "../controllers/message.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
router.route("/send/:receiverId").post(verifyJWT, upload.single("image"),  sendMessage)
router.route("/:receiverId").get(verifyJWT, getMessages)

export default router