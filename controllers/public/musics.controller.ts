import { Request, Response, NextFunction } from "express";
import { Music, MusicsModel } from "../../models/musics.model";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import ENV from "../../config/env.config";
import OpenAI from "openai";
import { randomUUID } from "crypto";

export class PublicMusicsController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const musics = await MusicsModel.aggregate([
        {
          $group: {
            _id: "$mood",
            musics: { $push: "$$ROOT" },
          },
        },
        {
          $group: {
            _id: null,
            data: {
              $push: {
                k: "$_id",
                v: "$musics",
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayToObject: "$data",
            },
          },
        },
      ]);
      res.status(200).json({
        success: true,
        data: musics[0],
        message: "Musics retrieved successfully",
      });
    } catch (error) {
      next(new Error("Failed to fetch musics"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await MusicsModel.findOne({ slug });

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
      next(new Error("Failed to fetch musics"));
    }
  }

  async analyseMood(
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) {
    try {
      // Check if photo is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Photo is required",
        });
      }

      // Upload image to S3
      const { url } = await uploadToS3(
        req.file.buffer,
        req.file.filename || randomUUID(),
        req.file.mimetype,
        "/user-images"
      );

      // Call ChatGPT API to analyze mood
      const openai = new OpenAI({
        apiKey: ENV.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Use GPT-4 Vision model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze the facial expression in this image and determine the person's mood. You must respond with ONLY ONE of these four words: happy, sad, angry, or not_found. If no clear facial expression is visible or no person is detected, respond with 'not_found'.",
              },
              {
                type: "image_url",
                image_url: {
                  url,
                },
              },
            ],
          },
        ],
        max_tokens: 10,
        temperature: 0, // Keep it deterministic
      });

      const detectedMood = response.choices[0]?.message?.content
        ?.trim()
        .toLowerCase();
      console.log("open ai : ", response.choices[0]);
      // Validate the response
      const validMoods = ["happy", "sad", "angry", "not_found"];
      const mood = validMoods.includes(detectedMood ?? "")
        ? detectedMood
        : "not_found";

      let musicList: Music[] = [];

      // If mood is detected, query for music with that mood
      if (mood !== "not_found") {
        musicList = await MusicsModel.find({ mood: mood });
      }
      deleteFromS3(url);

      res.status(200).json({
        success: true,
        data: {
          musicList,
          mood,
        },
        message:
          mood === "not_found"
            ? "No clear mood detected in the image"
            : `Music recommendations based on ${mood} mood`,
      });
    } catch (error) {
      console.error("Error in analyseMood:", error);
      next(new Error("Failed to analyze mood"));
    }
  }
}
