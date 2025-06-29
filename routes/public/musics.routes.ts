import { PublicMusicsController } from "../../controllers/public/musics.controller";
import express, { Request, Response, NextFunction } from "express";
import upload from "../../utils/multer";
export const publicMusicsRouter = express.Router();
const publicMusicsController = new PublicMusicsController();

publicMusicsRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    publicMusicsController.findAll(req, res, next);
  }
);
publicMusicsRouter.post(
  "/mood",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    publicMusicsController.analyseMood(
      req as Request & { file: Express.Multer.File },
      res,
      next
    );
  }
);
publicMusicsRouter.get(
  "/:slug",
  (req: Request, res: Response, next: NextFunction) => {
    publicMusicsController.findOne(req, res, next);
  }
);
