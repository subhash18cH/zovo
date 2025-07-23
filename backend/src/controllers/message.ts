import { Request, Response } from "express";
import { User } from "../models/user";
import { IMessage, Message } from "../models/message";
import cloudinary from "../libs/cloudinary";
import { getReceiverSocketId, io } from "../libs/socket";

//extended user request
interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    userId: string;
  };
}

//GET- api/message/users - users for sidebar excluding you 
export const getUsersForSidebar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loggedInUserId = req.user?.userId;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//GET- api/message/:id - getting user messages 
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?.userId;

    const messages: IMessage[] = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ]
    });
    res.status(200).json(messages);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//POST- api/message/:id - sending messages to user 
export const sendMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, image }: { text?: string, image?: string } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?.userId;
    if (!senderId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let imageUrl: string | undefined;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, 
    });

    await newMessage.save();

    // Emit to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Emit to sender
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};