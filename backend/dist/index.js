"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const db_1 = require("./db/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./libs/socket");
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
//middlewares
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true
}));
//auth routes
socket_1.app.use("/api/auth", user_1.default);
//message routes
socket_1.app.use("/api/message", message_1.default);
//entry point
socket_1.server.listen(PORT, () => {
    console.log("server is running on " + PORT);
    (0, db_1.connectToDB)(); //db connection
});
