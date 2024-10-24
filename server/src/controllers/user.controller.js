import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import College from "../models/college.model.js";
import jwt from "jsonwebtoken";
import { transporter, sendEmail } from "../services/EmailService/sendEmail.js";
import Cache from "../modules/cache.js";
import dotenv from "dotenv";
dotenv.config();

export const fetchUserChatsforSideBar = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        match: { _id: { $ne: userId } }, // Exclude the current user from participants
        select: "name profilePic", // Select only the name of the participant
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
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    let find = {};

    if (token) {
      try {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_ACCESS_TOKEN_SECRET
        );
        find._id = { $ne: decodedToken.id }; // Exclude the current user from the results
      } catch (tokenError) {
        console.log("Error verifying token:", tokenError.message);
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    const { page = 0, limit = 2 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const users = await User.find(find)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .exec();

    const TotalCount = await User.countDocuments(find);

    res.status(200).json({ users, TotalCount });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json(err);
  }
};

export const fetchMentorsByCollegeName = async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) {
      filter.CourseofStream = req.query.course;
    }
    if (req.query.department) {
      filter.Department = req.query.department;
    }
    const { page = 0, limit = 2 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const college = req.params.id.trim();
    const re = new RegExp(`^${college}$`, "i");

    const {_id} = await College.findOne({ name: { $regex: re } }).select(
      "_id"
    );
    const CollegeId = _id.toString();
    if (!_id) {
      return res.status(404).json({ message: "College not found", data: [] });
    }
    filter.college = CollegeId;

    const totalCount = await User.countDocuments(filter);
    const mentors = await User.find(filter)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .select("-password -refreshToken");

    if (mentors.length === 0) {
      return res.status(200).json({ message: "No mentors present", data: [] });
    }

    res.status(200).json({
      data: mentors,
      totalCount,
      pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const fetchUserByName = async (req, res) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(`^${name}`, "i");
    const user = await User.find({ name: { $regex: regex } });
    console.log(user);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const fetchUserByCollegeName = async (req, res) => {
  try {
    const { page = 0, limit = 2 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const college = req.params.id;
    const re = new RegExp(`^${college}`, "i");
    const CollegeId = await College.findOne({ name: { $regex: re } }).select(
      "_id"
    );

    if (!CollegeId) {
      return res.status(404).json({ message: "College not found", data: [] });
    }
    const totalCount = await User.countDocuments({ college: CollegeId });
    const mentors = await User.find({ college: CollegeId })
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .select("-password -refreshToken");
    //const currentPage = pageNumber;
    if (mentors.length === 0) {
      return res.status(200).json({ message: "No mentors present", data: [] });
    }
    res.status(200).json({
      data: mentors,
      totalCount,
      pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//GET SPECIFIC USER DETAILS
export const fetchUserDetailsById = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id)
      .select("-password -refreshToken")
      .populate("college");
    if (!user) {
      return res.status(404).json({ message: "User not found", data: [] });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const fetchUserDetailsByIdForChatsByParam = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password -refreshToken")
      .populate("college");
    if (!user) {
      return res.status(404).json({ message: "User not found", data: [] });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const RequestMentorSendEmail = async (req, res) => {
  try {
    const { name, message, college, department, email } = req.body;

    // Email options
    let mailOptions = {
      from: `"${name}" <${email}>`, // Sender address
      to: "yogieswar.ananthu7@gmail.com", // List of recipients
      subject: "Request Mentor from Uniconn", // Subject line
      html: `<div>Hi Team, I need a mentor from <b>${college}</b> college of Department <b>${department}</b>.
              I am ${name}<br/>. This is my small request: <b>${message}</b></div>`, // HTML body
    };

    // Send email
    const info = await sendEmail(mailOptions);
    return res.status(200).json({ info, message: "Successfully sent" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};



export const suggestedUsers = async (req,res) => {
  try{
    const cache = new Cache();
    const checkIfKeyExist = cache.isKeyExists('suggestedUsers');

    if (checkIfKeyExist == true) {
      const users = cache.getValue('suggestedUsers');
      return res.status(200).json({message:"Users Found",
        Response : true,
        foundUsersCount : users.length,
        suggestedUsers : users
      }); // if users found

    }else {

      const aggregationStages = [{$match:{isUserSuggested:true}},
        {$project:{refreshToken:0,coins:0,password:0,phone:0,}}];
    
        const users = await User.aggregate(aggregationStages);
        cache.setKeyAndValue('suggestedUsers',users);
        
        return res.status(200).json({message:"Users Found",
          Response : true,
          foundUsersCount : users.length,
          suggestedUsers : users
        });    
    }

  }catch(error) {
    console.log(error);
    res.status(500).json({message:"Internal Server Error"});
  }
}