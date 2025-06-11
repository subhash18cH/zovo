"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const validateToken_1 = require("../middlewares/validateToken");
const router = express_1.default.Router();
router.post("/signup", user_1.registerUser);
router.post("/login", user_1.loginUser);
router.post("/logout", user_1.logout);
router.put("/update-profile", validateToken_1.validateToken, user_1.updateProfile);
router.get("/check", validateToken_1.validateToken, user_1.checkAuth);
exports.default = router;
