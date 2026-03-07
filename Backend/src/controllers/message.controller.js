import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



// Send a message
const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  const { message } = req.body

  let image

  if (req.file && req.file.path) {
    image = await uploadOnCloudinary(req.file.path)
  }

  let chats = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  })

  if (!chats) {
    chats = await Conversation.create({
      participants: [senderId, receiverId]
    })
  }

  if(!message && !image){
     throw new ApiError(400, "Message or image required.")
  }

  const newMessage = await Message.create({
    conversationId: chats._id,
    senderId,
    receiverId,
    message: message || "",
    image: image?.url || undefined,
  })

  if (newMessage) {
    chats.messages.push(newMessage._id);
  }


  await Promise.all([chats.save(), newMessage.save()])

  // Socket IO
  const receiverSocketId = getReceiverSocketId(receiverId)

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage)
  }

  return res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

// Get all messages in a conversation
const getMessages = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  const chats = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  }).populate("messages")

  if (!chats) {
    return res.status(200).json(new ApiResponse(200, [], "Conversation not found"));
  }

  const message = chats.messages

  return res.status(200).json(new ApiResponse(200, message, "Messages fetched successfully"));
});

export {
  sendMessage,
  getMessages
};
