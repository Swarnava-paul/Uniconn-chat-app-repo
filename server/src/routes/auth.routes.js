import express from "express"
import { registerUser,loginUser,logoutUser } from "../controllers/auth.controller.js"
import verifyToken from "../middlewares/verifyJwt.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout",verifyToken, logoutUser)

export default router
