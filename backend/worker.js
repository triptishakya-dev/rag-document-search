import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { QdrantClient } from "@qdrant/js-client-rest";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import pdf from "pdf-parse";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { uploadFile } from "./lib/s3.js";
import { getEmbedding } from "./lib/embedding.js";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const qdrant = new QdrantClient({ host: "localhost", port: 6333 });

const worker = new Worker("pdf-processing", async (job) => {
    const { filePath, originalName, mimeType, clientId } = job.data;
    console.log(`Processing job ${job.id} for file: ${originalName}`);

    try {
        // 1. Upload to S3
        const s3Key = `uploads/${Date.now()}-${originalName}`;
        const s3Url = await uploadFile(filePath, process.env.BUCKET_NAME, s3Key, mimeType);
        console.log(`Uploaded to S3: ${s3Url}`);

        // 2. Create Document in Postgres
        const document = await prisma.document.create({
            data: {
                title: originalName,
                sourceUrl: s3Url,
                clientId: clientId || "default", // Adjust as needed
                updatedAt: new Date(), // Explicitly set updatedAt if needed, though @updatedAt handles it
            },
        });
        console.log(`Document created in DB with ID: ${document.id}`);

        // ... inside worker ...

        // 3. Load and Split PDF -chunks
        console.log(`Parsing PDF file: ${filePath}`);
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const docs = [
            new Document({
                pageContent: data.text,
                metadata: { source: filePath, pdf_numpages: data.numpages }
            })
        ];
        console.log(`PDF loaded, text length: ${data.text.length}`);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await splitter.splitDocuments(docs);
        console.log(`Text split into ${chunks.length} chunks`);

        // 4. Process Chunks (Store in PG + Embed + Store in Qdrant)
        const points = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkContent = chunk.pageContent;
            const embedding = await getEmbedding(chunkContent);

            // Save to Postgres
            await prisma.chunk.create({
                data: {
                    documentId: document.id,
                    chunkIndex: i,
                    text: chunkContent,
                    embedding: embedding, // Storing raw JSON array
                    // page: chunk.metadata.loc.pageNumber, // Check metadata structure
                }
            });
            console.log(`Processed chunk ${i + 1}/${chunks.length}`);

            // Prepare for Qdrant
            points.push({
                id: uuidv4(),
                vector: embedding,
                payload: {
                    documentId: document.id,
                    text: chunkContent,
                    chunkIndex: i,
                    sourceUrl: s3Url
                },
            });
        }
        console.log(`All chunks processed and stored in PG. Points prepared for Qdrant.`);

        // 5. Save to Qdrant
        const collectionName = "documents";
        // Ensure collection exists
        try {
            await qdrant.getCollection(collectionName);
            console.log(`Qdrant collection '${collectionName}' exists.`);
        } catch (e) {
            console.log(`Creating Qdrant collection '${collectionName}'...`);
            await qdrant.createCollection(collectionName, {
                vectors: { size: 3072, distance: "Cosine" }, // Updated to match Gemini embedding-001 output (3072)
            });
        }

        console.log(`Upserting ${points.length} points to Qdrant...`);
        await qdrant.upsert(collectionName, {
            wait: true,
            points: points,
        });

        console.log(`Job ${job.id} completed. Processed ${chunks.length} chunks.`);
        console.log("-----------------------------------------");
        console.log("Worker is ready for new jobs...");

        // Cleanup local file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        throw error;
    }
}, {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
    }
});

console.log("Worker started...");
