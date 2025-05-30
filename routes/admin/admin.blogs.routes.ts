import express, { NextFunction, Request, Response } from "express";
import { AdminBlogsController } from "../../controllers/admin/blogs.controller";
import upload from "../../utils/multer";

export const adminBlogsRouter = express.Router();
const adminBlogsController = new AdminBlogsController();

adminBlogsRouter
  .post(
    "/",
    upload.single("thumbnail"),
    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.create(
        req as Request & { file: Express.Multer.File },
        res,
        next
      )
  )
  .put(
    "/:blogId",
    upload.single("thumbnail"),

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.update(
        req as Request & { file: Express.Multer.File },
        res,
        next
      )
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.findAll(req, res, next)
  )
  .get(
    "/:blogId",

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.findById(req, res, next)
  );

export default adminBlogsRouter;
