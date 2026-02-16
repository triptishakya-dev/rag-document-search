import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const pdfQueue = new Queue("pdf-processing", { connection });
