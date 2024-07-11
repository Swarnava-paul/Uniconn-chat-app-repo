import express from "express";
import {
  fetchUserChatsforSideBar,
  fetchUsersWithPagination,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyJwt.js";

const router = express.Router();
router.get("/", fetchUsersWithPagination);
router.get("/chat", verifyToken, fetchUserChatsforSideBar);

export default router;
