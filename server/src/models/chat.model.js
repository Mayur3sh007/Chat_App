import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    default: null
  },
  media: {
    type: String,
    default: null
  },
  username: {
    type: String,
    required: true
  },
  clientMessageId: {
    type: String,
    unique: true // Prevent duplicate messages
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Chat = mongoose.model("Chat", chatSchema);
