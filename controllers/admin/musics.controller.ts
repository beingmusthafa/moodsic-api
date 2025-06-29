import { Request, Response, NextFunction } from "express";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { MusicsModel } from "../../models/musics.model";
import { ControllerResponse } from "../../types";

export class AdminMusicsController {
  async create(
    req: Request & {
      files: { audio: Express.Multer.File[]; image: Express.Multer.File[] };
    },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, mood } = req.body;
      const artists = JSON.parse(req.body.artists);
      const audioFile = req.files?.audio?.[0];
      const imageFile = req.files?.image?.[0];

      if (!audioFile || !imageFile) {
        res.status(400).json({
          success: false,
          message: "Both audio and image files are required",
        } as ControllerResponse);
        return;
      }

      const [audioUpload, imageUpload] = await Promise.all([
        uploadToS3(
          audioFile.buffer,
          `${title.replace(/\s+/g, "")}_audio`,
          audioFile.mimetype,
          "/musics/audio"
        ),
        uploadToS3(
          imageFile.buffer,
          `${title.replace(/\s+/g, "")}_image`,
          imageFile.mimetype,
          "/musics/images"
        ),
      ]);

      await MusicsModel.create({
        title,
        audioUrl: audioUpload.url,
        imageUrl: imageUpload.url,
        artists: Array.isArray(artists) ? artists : [artists],
        mood,
      });

      res.status(200).json({
        success: true,
        message: "Music created successfully",
      } as ControllerResponse);
    } catch (error) {
      console.log((error as Error).message);
      next(new Error("Failed to create music"));
    }
  }

  async update(
    req: Request & {
      files: { audio: Express.Multer.File[]; image: Express.Multer.File[] };
    },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { musicId } = req.params;
      const { title, mood } = req.body;

      const artists = JSON.parse(req.body.artists);
      const audioFile = req.files?.audio?.[0];
      const imageFile = req.files?.image?.[0];

      const music = await MusicsModel.findById(musicId);
      if (!music) {
        res.status(404).json({
          success: false,
          message: "Music not found",
        } as ControllerResponse);
        return;
      }

      const uploads = [];
      if (audioFile) {
        uploads.push(
          deleteFromS3(music.audioUrl).then(() =>
            uploadToS3(
              audioFile.buffer,
              `${title.replace(/\s+/g, "")}_audio`,
              audioFile.mimetype,
              "/musics/audio"
            )
          )
        );
      }
      if (imageFile) {
        uploads.push(
          deleteFromS3(music.imageUrl).then(() =>
            uploadToS3(
              imageFile.buffer,
              `${title.replace(/\s+/g, "")}_image`,
              imageFile.mimetype,
              "/musics/images"
            )
          )
        );
      }

      const results = await Promise.all(uploads);
      let audioUrl = music.audioUrl;
      let imageUrl = music.imageUrl;

      if (audioFile && results[0]) audioUrl = results[0].url;
      if (imageFile) imageUrl = results[audioFile ? 1 : 0]?.url || imageUrl;

      await MusicsModel.findByIdAndUpdate(musicId, {
        title,
        audioUrl,
        imageUrl,
        artists: Array.isArray(artists) ? artists : [artists],
        mood,
      });

      res.status(200).json({
        success: true,
        message: "Music updated successfully",
      } as ControllerResponse);
    } catch (error) {
      console.log((error as Error).message);
      next(new Error("Failed to update music"));
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { musicId } = req.params;
      const music = await MusicsModel.findById(musicId);

      res.status(200).json({
        success: true,
        data: music,
        message: "Music retrieved successfully",
      } as ControllerResponse);
    } catch (error) {
      console.error("Error finding music:", error);
      next(new Error("Failed to find music"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const musics = await MusicsModel.find();

      res.status(200).json({
        success: true,
        data: musics,
        message: "Musics retrieved successfully",
      } as ControllerResponse);
    } catch (error) {
      console.error("Error finding musics:", error);
      next(new Error("Failed to find musics"));
    }
  }
}
