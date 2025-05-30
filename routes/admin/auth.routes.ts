import express, { NextFunction, Request, Response } from "express";
import { AdminAuthController } from "../../controllers/admin/auth.controller";

const adminAuthController = new AdminAuthController();
export const adminAuthRouter = express.Router();

adminAuthRouter.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    adminAuthController.login(req, res, next);
  }
);
