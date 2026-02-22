import mongoose from "mongoose";

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

const DB = `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?authSource=admin`;

export default function dbConnect() {
  mongoose
    .connect(DB)
    .then(() => console.log("DB connection successful!"))
    .catch((err) => {
      console.error("❌ DB connection error:", err.message);
      process.exit(1);
    });
}
