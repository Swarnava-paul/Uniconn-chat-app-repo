import express from "express";
import {
  fetchAllUsers,
  fetchUserByCollegeName,
  fetchUserByName,
  fetchUserChatsforSideBar,
  fetchUserDetailsById,
  fetchUsersWithPagination,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyJwt.js";

const router = express.Router();
router.get("/", fetchUsersWithPagination);
router.get("/chat", verifyToken, fetchUserChatsforSideBar);
router.get("/search/:name", fetchUserByName);
router.get("/sample", fetchAllUsers);
router.get("/get/:id", fetchUserByCollegeName);
router.get("/:id", fetchUserDetailsById);

export default router;
