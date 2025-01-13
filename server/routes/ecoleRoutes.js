const express = require("express");
const { addBulkStudents, addStudent } = require("../controllers/ecoleController");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads folder exists at the start of the server
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    console.log("Uploads folder does not exist, creating...");
    fs.mkdirSync(uploadPath, { recursive: true });
} else {
    console.log("Uploads folder exists:", uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Resolved upload path:", uploadPath);
        cb(null, uploadPath); // Pass the path to multer
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        console.log("Generated filename:", uniqueName);
        cb(null, uniqueName); // Add file extension
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
}).single("file");

router.post("/bulk", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ error: "File size exceeds the limit (10MB)" });
            }
            return res.status(500).json({ error: "File upload error" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("Uploaded file details:", req.file);

        // Ensure the file was written to the correct path
        if (!fs.existsSync(req.file.path)) {
            console.error("File not found at expected location:", req.file.path);
            return res.status(500).json({ error: "File was not saved correctly" });
        }

        console.log("File successfully uploaded to:", req.file.path);
        next();
    });
}, addBulkStudents);

router.post("/", addStudent);

module.exports = router;
