import { QdrantClient } from "@qdrant/js-client-rest";
import { getEmbedding } from "../lib/embedding.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const qdrant = new QdrantClient({ host: "localhost", port: 6333 });
const COLLECTION_NAME = "documents";

export const chat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        console.log(`Received question: ${question}`);

        // 1. Generate embedding for the question
        const embedding = await getEmbedding(question);

        // 2. Search Qdrant for relevant chunks
        let searchResult = [];
        try {
            searchResult = await qdrant.search(COLLECTION_NAME, {
                vector: embedding,
                limit: 5,
            });
        } catch (e) {
            console.log("Error searching Qdrant:", e.message);
            // Verify if it's a 404 or just general error. Assuming if search fails, we have no context.
            // If collection doesn't exist, it throws 404/Not Found.
            searchResult = [];
        }

        // 3. Construct context from search results
        const context = searchResult.map(item => item.payload.text).join("\n\n");
        const sources = searchResult.map(item => ({
            sourceUrl: item.payload.sourceUrl,
            documentId: item.payload.documentId
        }));

        console.log(`Found ${searchResult.length} relevant chunks`);

        // 4. Call Gemini
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GEMINI_API_KEY,
            temperature: 0.7,
        });

        const prompt = `
        You are a helpful AI assistant. Answer the user's question based ONLY on the following context. 
        If the answer is not in the context, say "I don't have enough information to answer that based on the provided documents."
        
        Context:
        ${context}
        
        Question:
        ${question}
        `;

        const response = await model.invoke(prompt);
        const answer = response.content;

        res.json({
            answer,
            sources
        });

    } catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message,
            stack: error.stack
        });
    }
};
