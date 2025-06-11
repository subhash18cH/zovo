"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = require("../middlewares/validateToken");
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
router.get("/users", validateToken_1.validateToken, message_1.getUsersForSidebar);
router.get("/:id", validateToken_1.validateToken, message_1.getMessages);
router.post("/send/:id", validateToken_1.validateToken, message_1.sendMessages);
exports.default = router;
