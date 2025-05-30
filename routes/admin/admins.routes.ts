import express, { NextFunction, Request, Response } from "express";
import { AdminAdminsController } from "../../controllers/admin/admins.controller";
import upload from "../../utils/multer";

export const adminAdminsRouter = express.Router();
const adminAdminsController = new AdminAdminsController();

adminAdminsRouter.post(
  "/",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminAdminsController.create(
      req as Request & { file: Express.Multer.File },
      res,
      next
    )
);

adminAdminsRouter.put(
  "/:adminId",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminAdminsController.update(
      req as Request & { file: Express.Multer.File },
      res,
      next
    )
);

adminAdminsRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  adminAdminsController.getAll(req, res, next)
);
