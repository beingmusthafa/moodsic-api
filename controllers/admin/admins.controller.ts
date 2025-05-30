import { Request, Response, NextFunction } from "express";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { AdminModel } from "../../models/admin.model";
import bcrypt from "bcryptjs";
import { resizeImage } from "../../utils/sharp";
import { ControllerResponse } from "../../types";

export class AdminAdminsController {
  async create(
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {
    try {
      const imageFile = req.file;
      const { fullName, email, password, role, isActive, phone } = req.body as {
        fullName: string;
        email: string;
        password: string;
        role: "super" | "manager";
        isActive: boolean;
        phone: string;
      };
      let imageUrl = "";
      if (imageFile) {
        const resizedImage = await resizeImage(imageFile.buffer, 600, 600);
        const { url } = await uploadToS3(
          resizedImage,
          imageFile.originalname,
          imageFile.mimetype,
          "admins/profile-images"
        );
        imageUrl = url;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminModel.create({
        fullName,
        email,
        image: imageUrl,
        password: hashedPassword,
        role,
        phone,
        isActive,
      });
      res.status(201).json({
        success: true,
        message: "User created successfully",
      } as ControllerResponse);
    } catch (error) {
      console.log(error);
      next(new Error("Failed to create admin"));
    }
  }

  async update(
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { adminId } = req.params;
      const imageFile = req.file;
      const data = req.body as {
        fullName: string;
        email: string;
        password: string;
        role: "super" | "manager";
        isActive: boolean;
        phone: string;
      };
      const admin = await AdminModel.findById(adminId);
      if (!admin) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      let newImage;
      if (imageFile) {
        const resizedImage = await resizeImage(imageFile.buffer, 600, 600);
        if (admin.image) await deleteFromS3(admin.image);
        const { url: ImageUrl } = await uploadToS3(
          resizedImage,
          imageFile.originalname,
          imageFile.mimetype,
          "admins/profile-images"
        );
        newImage = ImageUrl;
      }
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      }

      admin.set({
        fullName: data.fullName || admin.fullName,
        email: data.email || admin.email,
        image: newImage || admin.image,
        password: data.password || admin.password,
        role: data.role || admin.role,
        phone: data.phone || admin.phone,
        isActive: data.isActive ?? admin.isActive,
      });

      await admin.save();

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: admin,
      } as ControllerResponse);
    } catch (error) {
      next(new Error("Failed to create admin"));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await AdminModel.find().select("-password");
      res.status(200).json({
        success: true,
        message: "Admins fetched successfully",
        data: admins,
      } as ControllerResponse);
    } catch (error) {
      next(new Error("Failed to fetch admins"));
    }
  }
}
