import express, { NextFunction, Request, Response } from "express";
import { AdminMusicsController } from "../../controllers/admin/musics.controller";
import upload from "../../utils/multer";

export const adminMusicsRouter = express.Router();
const adminMusicsController = new AdminMusicsController();

adminMusicsRouter
  .post(
    "/",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
    (req: Request, res: Response, next: NextFunction) =>
      adminMusicsController.create(
        req as Request & {
          files: { audio: Express.Multer.File[]; image: Express.Multer.File[] };
        },
        res,
        next
      )
  )
  .put(
    "/:musicId",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
    (req: Request, res: Response, next: NextFunction) =>
      adminMusicsController.update(
        req as Request & {
          files: { audio: Express.Multer.File[]; image: Express.Multer.File[] };
        },
        res,
        next
      )
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminMusicsController.findAll(req, res, next)
  )
  .get(
    "/:musicId",

    (req: Request, res: Response, next: NextFunction) =>
      adminMusicsController.findById(req, res, next)
  );

export default adminMusicsRouter;
