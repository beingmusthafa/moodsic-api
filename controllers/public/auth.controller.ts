import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/user.model";
import { generateTokens } from "../../utils/token";
import bcryptjs from "bcryptjs";

export class PublicAuthController {
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

      // 2. Find user by email (including hashed password)
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // 5. Generate JWT tokens
      const { accessToken } = generateTokens({
        _id: user._id as any,
        email: user.email,
        role: user.role,
      });

      // 6. Prepare user data for response (excluding password)
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // 7. Send successful response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userData,
          token: accessToken,
        },
      });
    } catch (error) {
      console.error("User login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      // 1. Validate request body
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Full name, email, and password are required",
        });
      }

      // 2. Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // 3. Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // 4. Create a new user
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });

      // 5. Save the user to the database
      await newUser.save();

      // 6. Send successful response
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("User registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
