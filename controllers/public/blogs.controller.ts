import { Request, Response, NextFunction } from "express";
import { BlogsModel } from "../../models/blogs.model";

export class PublicBlogsController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await BlogsModel.find().select("-content");

      res.status(200).json({
        success: true,
        data: blogs,
        message: "Blogs retrieved successfully",
      });
    } catch (error) {
      next(new Error("Failed to fetch blogs"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await BlogsModel.findOne({ slug });

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      res.status(200).json({
        success: true,
        data: blog,
        message: "Blog retrieved successfully",
      });
    } catch (error) {
      next(new Error("Failed to fetch blogs"));
    }
  }
}
