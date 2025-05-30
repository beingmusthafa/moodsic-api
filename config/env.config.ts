import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT!,
  MONGO_URI: process.env.MONGO_URI!,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
};

Object.entries(ENV).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`ENV value missing for : ${key}`);
  }
});

export default ENV;
