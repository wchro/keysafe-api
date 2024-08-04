import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/me", UserController.getInfo);

export default userRouter;
