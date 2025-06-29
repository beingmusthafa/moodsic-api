import express from "express";
import { connectMongoDB } from "./config/database.config";
import ENV from "./config/env.config";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import morgan from "morgan";
import cors from "cors";
import publicRouter from "./routes/public.routes";
import { MusicsModel } from "./models/musics.model";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectMongoDB();

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/public", publicRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/create-music", async (req, res, next) => {
  try {
    const docs = req.body;
    await MusicsModel.insertMany(docs);
    res.send("Done");
  } catch (error) {
    console.log(error);
  }
});

app.listen(ENV.PORT || 5000, () => {
  console.log("App running on port : ", ENV.PORT);
});
