import express from "express";
import multer from "multer";
import { uploadDocument } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /documents
router.post("/upload-documents", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, uploadDocument);

export default router;  