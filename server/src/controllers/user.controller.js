import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const fetchUserChatsforSideBar = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        match: { _id: { $ne: userId } }, // Exclude the current user from participants
        select: "name", // Select only the name of the participant
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "name", // Select the name of the sender
        },
      });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fetchUsersWithPagination = async (req, res) => {
  try {
    console.log(req.query);
    const { page = 0, limit = 2 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const users = await User.find()
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .exec();
    const TotalCount = await User.countDocuments();
    const currentPage = page * limit;
    res.status(200).json({ users, TotalCount });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const fetchMentorsByCollegeName = async (req, res) => {
  try {
    const college = req.params.id;
    const mentors = await User.find({ college: college }).exec();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error });
  }
};
