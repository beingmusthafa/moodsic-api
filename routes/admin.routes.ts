import express from "express";
import { adminAdminsRouter } from "./admin/admins.routes";
import { adminBlogsRouter } from "./admin/admin.blogs.routes";
import { adminAuthRouter } from "./admin/auth.routes";

const adminRouter = express.Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/admins", adminAdminsRouter);
adminRouter.use("/blogs", adminBlogsRouter);

export default adminRouter;
