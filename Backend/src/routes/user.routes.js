import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    getAllUsers,
    editUserDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(upload.fields([{ name: "profile", maxCount: 1 }]), registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/all").get(verifyJWT, getAllUsers);
router.route("/edit-profile").patch(verifyJWT, upload.fields([{ name: "profile", maxCount: 1 }]), editUserDetails)

export default router