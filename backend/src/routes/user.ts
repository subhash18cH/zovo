import express, { Router } from "express";
import { registerUser } from "../controllers/user";

const router: Router = express.Router();

router.post("/signup", registerUser);

export default router;