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
exports.checkAuth = exports.updateProfile = exports.logout = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
//POST- api/auth/signup - for registering user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password must be atleast 6 characters" });
            return;
        }
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield user_1.User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            res.status(201).json("user registered successfully");
            return;
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.registerUser = registerUser;
//POST- api/auth/login - for login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields required" });
            return;
        }
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development"
        });
        res.status(200).json({ token, email: user.email, fullName: user.fullName, createdAt: user.createdAt, profilePic: user.profilePic });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
//POST- api/auth/logout - for logout user
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json("logged out successfully");
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.logout = logout;
//PUT- api/auth/update-profile - for updating profile image of a user
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { profilePic } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!profilePic) {
            res.status(400).json("Profile pic is required");
            return;
        }
        const updatedProfile = yield cloudinary_1.default.uploader.upload(profilePic);
        const updatedUser = yield user_1.User.findByIdAndUpdate(userId, { profilePic: updatedProfile.secure_url }, { new: true });
        res.status(200).json(updatedUser);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateProfile = updateProfile;
//GET- api/auth/check - for checking user authentication
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(req.user);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.checkAuth = checkAuth;
