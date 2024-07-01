import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const fetchUserChatsforSideBar = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: userId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          participants: {
            $filter: {
              input: "$participants",
              as: "participant",
              cond: { $ne: ["$$participant._id", userId] },
            },
          },
        },
      },
      {
        $project: {
          participants: {
            $map: {
              input: "$participants",
              as: "participant",
              in: { name: "$$participant.name" },
            },
          },
          lastMessage: {
            message: "$lastMessage.message",
            createdAt: "$lastMessage.createdAt",
          },
          updatedAt: 1, // Include updatedAt for sorting
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fetchUsersWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const users = await User.find()
      .skip(page * limit)
      .limit(limit)
      .exec();
    res.status(200).json(users);
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
