import express from "express";
import { publicMusicsRouter } from "./public/musics.routes";
import { publicAuthRouter } from "./public/auth.routes";

const publicRouter = express.Router();

publicRouter.use("/auth", publicAuthRouter);
publicRouter.use("/musics", publicMusicsRouter);

export default publicRouter;
