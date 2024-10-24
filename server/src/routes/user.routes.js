import express from "express";
import {
  fetchAllUsers,
  fetchMentorsByCollegeName,
  fetchUserByCollegeName,
  fetchUserByName,
  fetchUserChatsforSideBar,
  fetchUserDetailsById,
  fetchUserDetailsByIdForChatsByParam,
  fetchUsersWithPagination,
  RequestMentorSendEmail,
  suggestedUsers
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyJwt.js";


const userRoutes = express.Router();


userRoutes.get("/", fetchUsersWithPagination);
userRoutes.get('/suggestedUsers',suggestedUsers);
userRoutes.get("/chat", verifyToken, fetchUserChatsforSideBar);
userRoutes.get("/search/:name", fetchUserByName);
userRoutes.get("/sample", fetchAllUsers);
userRoutes.get("/find/profile", verifyToken, fetchUserDetailsById);
userRoutes.get("/:id", fetchUserDetailsByIdForChatsByParam);
userRoutes.get("/get/:id", fetchMentorsByCollegeName);
userRoutes.post("/request-mentor", RequestMentorSendEmail);




export default userRoutes;
