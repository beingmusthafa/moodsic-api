import express from "express";
import { PublicAuthController } from "../../controllers/public/auth.controller";

export const publicAuthRouter = express.Router();
const publicAuthController = new PublicAuthController();

publicAuthRouter.post("/login", (req, res, next) => {
  publicAuthController.login(req, res, next);
});

publicAuthRouter.post("/register", (req, res, next) => {
  publicAuthController.register(req, res, next);
});
