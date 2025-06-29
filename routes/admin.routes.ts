import express from "express";
import { adminMusicsRouter } from "./admin/admin.musics.routes";

const adminRouter = express.Router();

adminRouter.use("/musics", adminMusicsRouter);

export default adminRouter;
