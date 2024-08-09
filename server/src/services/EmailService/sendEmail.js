import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASSWORD, // Replace with your email password
  },
});
