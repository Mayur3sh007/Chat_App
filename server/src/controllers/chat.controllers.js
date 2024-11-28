import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming this function handles the upload process

const saveMessage = asyncHandler(async (req, res) => {
  const { senderId, message, username } = req.body; // Extract senderId and message from the request body
  console.log("Request Body:", req.body);
  const senderObjectId = new mongoose.Types.ObjectId(senderId);
  let mediaUrl = null;
  if (req.file) {
    const uploadedMedia = await uploadOnCloudinary(req.file.path); // Upload the file
    if (!uploadedMedia) {
      throw new Error("Media upload failed");
    }
    mediaUrl = uploadedMedia.url; // Save the media URL
  }
  
  if(!username) throw new Error("Username is required");
  if(!senderId) throw new Error("Sender ID is required");
  // Create a new chat message
  const chatMessage = await Chat.create({
    sender: senderObjectId,
    username,
    message,
    media: mediaUrl,
  });

  return res.status(201).json({
    success: true,
    data: chatMessage,
  });
});



// Fetch chat history
const getChatHistory = asyncHandler(async (req, res) => {
  const chatHistory = await Chat.find()
    .populate("sender", "username") 
    .sort({ timestamp: 1 }); 

  res.status(200).json({
    success: true,
    data: chatHistory,
  });
});


export { saveMessage, getChatHistory };
