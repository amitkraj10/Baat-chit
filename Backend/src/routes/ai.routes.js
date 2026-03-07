import { Router } from "express";
import { aiChat } from "../controllers/ai.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/chat").post(verifyJWT, aiChat)

export default router