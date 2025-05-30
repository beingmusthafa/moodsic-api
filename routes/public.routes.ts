import express from "express";
import { publicBlogsRouter } from "./public/blogs.routes";

const publicRouter = express.Router();

publicRouter.use("/blogs", publicBlogsRouter);

export default publicRouter;
