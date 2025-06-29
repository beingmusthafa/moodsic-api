// src/middlewares/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token";

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
      return res.status(401).json({ message: "Access token not provided" });
    }

    // 2. Verify access token
    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }

    // 3. Find admin in database
    const admin = await UserModel.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // 4. Attach admin to request
    (req as any).admin = admin.toObject();

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get refresh token from body
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    // 2. Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // 3. Find admin in database
    const admin = await UserModel.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // 4. Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      _id: admin._id as any,
      email: admin.email,
      role: admin.role,
    });

    // 5. Return new tokens
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
