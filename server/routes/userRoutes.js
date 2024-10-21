import express from "express";
import { clerkWebhooks, UserCredits } from "../controllers/UserController.js";
import authUser from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/webhooks", clerkWebhooks);
userRouter.get("/credits",authUser,UserCredits)

export default userRouter;