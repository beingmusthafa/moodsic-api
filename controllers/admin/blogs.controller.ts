import { Request, Response, NextFunction } from "express";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { BlogsModel } from "../../models/blogs.model";
import { ControllerResponse } from "../../types";

export class AdminBlogsController {
  async create(
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, subtitle, content } = req.body;
      const thumbnailFile = req.file;

      if (!thumbnailFile) {
        res.status(400).json({
          success: false,
          message: "Thumbnail is required",
        } as ControllerResponse);
        return;
      }

      const { url } = await uploadToS3(
        thumbnailFile.buffer,
        title.replace(" ", ""),
        thumbnailFile.mimetype,
        "/blogs"
      );

      await BlogsModel.create({
        title,
        subtitle,
        content,
        thumbnail: url,
      });

      res.status(200).json({
        success: true,
        message: "Blog created successfully",
      } as ControllerResponse);
    } catch (error) {
      console.log((error as Error).message);
      next(new Error("Failed to create blog"));
    }
  }

  async update(
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blogId } = req.params;
      const { title, subtitle, content } = req.body;
      const thumbnailFile = req.file;

      const blog = await BlogsModel.findById(blogId);
      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        } as ControllerResponse);
        return;
      }

      if (thumbnailFile) {
        await deleteFromS3(blog.thumbnail);
        const { url } = await uploadToS3(
          thumbnailFile.buffer,
          title.replace(" ", ""),
          thumbnailFile.mimetype,
          "/blogs"
        );
        blog.thumbnail = url;
      }

      blog.title = title;
      blog.subtitle = subtitle;
      blog.content = content;
      await blog.save();

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
      } as ControllerResponse);
    } catch (error) {
      console.log((error as Error).message);
      next(new Error("Failed to update blog"));
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogId } = req.params;
      const blog = await BlogsModel.findById(blogId);

      res.status(200).json({
        success: true,
        data: blog,
        message: "Blog retrieved successfully",
      } as ControllerResponse);
    } catch (error) {
      console.error("Error finding blog:", error);
      next(new Error("Failed to find blog"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await BlogsModel.find().select(
        "title thumbnail subtitle slug"
      );

      res.status(200).json({
        success: true,
        data: blogs,
        message: "Blogs retrieved successfully",
      } as ControllerResponse);
    } catch (error) {
      console.error("Error finding blogs:", error);
      next(new Error("Failed to find blogs"));
    }
  }
}
