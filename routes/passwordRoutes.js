import { Router } from "express";
import PasswordController from "../controllers/paasswordController.js";

const passwordRouter = Router();

passwordRouter.get("/", PasswordController.getPasswords);

passwordRouter.post("/", PasswordController.createPassword);
passwordRouter.patch("/", PasswordController.update);
passwordRouter.delete("/", PasswordController.delete);

export default passwordRouter;
