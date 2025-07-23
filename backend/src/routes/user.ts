import express, { Router } from "express";
import { checkAuth, loginUser, registerUser, updateProfile } from "../controllers/user";
import { validateToken } from "../middlewares/validateToken";

const router: Router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/update-profile", validateToken, updateProfile);

//to remove
router.get("/check", validateToken, checkAuth);

export default router;