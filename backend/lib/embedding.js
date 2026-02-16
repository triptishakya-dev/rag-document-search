import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // Updated to a newer model
    apiKey: process.env.GEMINI_API_KEY,
});

export async function getEmbedding(text) {
    try {
        return await embeddings.embedQuery(text);
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}
