"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = exports.getMessages = exports.getUsersForSidebar = void 0;
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
const socket_1 = require("../libs/socket");
//GET- api/message/users - users for sidebar excluding you 
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const filteredUsers = yield user_1.User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUsersForSidebar = getUsersForSidebar;
//GET- api/message/:id - getting user messages 
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: userToChatId } = req.params;
        const myId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const messages = yield message_1.Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        });
        res.status(200).json(messages);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMessages = getMessages;
//POST- api/message/:id - sending messages to user 
const sendMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let imageUrl;
        if (image) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new message_1.Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // Use imageUrl instead of image
        });
        yield newMessage.save();
        // Emit to receiver
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        // Emit to sender as well (THIS IS THE MISSING PART)
        const senderSocketId = (0, socket_1.getReceiverSocketId)(senderId);
        if (senderSocketId) {
            socket_1.io.to(senderSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.sendMessages = sendMessages;
