import express from "express";
import { connectMongoDB } from "./config/database.config";
import ENV from "./config/env.config";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import authorRouter from "./routes/author.routes";
import morgan from "morgan";
import cors from "cors";
import publicRouter from "./routes/public.routes";

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
app.use("/author", authorRouter);
app.use("/public", publicRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(ENV.PORT || 5000, () => {
  console.log("App running on port : ", ENV.PORT);
});
