import { PublicBlogsController } from "../../controllers/public/blogs.controller";
import express, { Request, Response, NextFunction } from "express";
export const publicBlogsRouter = express.Router();
const publicBlogsController = new PublicBlogsController();

publicBlogsRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    publicBlogsController.findAll(req, res, next);
  }
);
publicBlogsRouter.get(
  "/:slug",
  (req: Request, res: Response, next: NextFunction) => {
    publicBlogsController.findOne(req, res, next);
  }
);
