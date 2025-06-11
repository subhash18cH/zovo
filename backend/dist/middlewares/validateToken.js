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
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ message: "UnAuthorized - No token provided" });
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return;
            }
            const { userId } = decoded;
            const user = yield user_1.User.findById(userId).select("-password");
            if (!user) {
                res.status(401).json({ message: "Unauthorized - User not found" });
                return;
            }
            req.user = {
                userId: userId,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            next();
        }));
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Something went wrong" });
    }
});
exports.validateToken = validateToken;
