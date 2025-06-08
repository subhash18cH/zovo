import express, { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message";

const router: Router = express.Router();

router.get("/users", validateToken, getUsersForSidebar);

router.get("/:id", validateToken, getMessages);

router.post("/send/:id", validateToken, sendMessages);

export default router;