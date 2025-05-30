import { NextFunction, Request, Response } from "express";
import { AdminModel } from "../../models/admin.model";
import { generateTokens } from "../../utils/token";
import bcryptjs from "bcryptjs";

export class AdminAuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const { email, password } = req.body;

      // 1. Validate request body
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // 2. Find admin by email (including hashed password)
      const admin = await AdminModel.findOne({ email });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // 4. Check if admin account is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: "Admin account is deactivated",
        });
      }

      // 5. Generate JWT tokens
      const { accessToken, refreshToken } = generateTokens({
        _id: admin._id as any,
        email: admin.email,
        role: admin.role,
      });

      // 6. Prepare admin data for response (excluding password)
      const adminData = {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        image: admin.image,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      };

      // 7. Send successful response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          admin: adminData,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
