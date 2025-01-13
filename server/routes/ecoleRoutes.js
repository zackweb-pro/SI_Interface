const express = require("express");
const { addBulkStudents, addStudent, getSelectedEntreprises, getAllEntreprises, selectEntreprise } = require("../controllers/ecoleController");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser"); // Add this to parse CSV files

// Ensure the uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
} else {
    console.log("Upload path already exists:", uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Pass the path to multer
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName); // Add file extension
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
}).single("file"); // Name of the field in your form

// Route for bulk file upload
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


        // Ensure the file was written to the correct path
        if (!fs.existsSync(req.file.path)) {
            console.error("File not found at expected location:", req.file.path);
            return res.status(500).json({ error: "File was not saved correctly" });
        }


        // Process the CSV file after uploading
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                // Now you can process the CSV data (insert into DB, etc.)
                // Pass the results to your addBulkStudents function or handle as needed
                addBulkStudents(req, res, results); // Assuming addBulkStudents handles the data
            })
            .on("error", (error) => {
                console.error("Error reading the CSV file:", error);
                res.status(500).json({ error: "Error reading the CSV file" });
            });
    });
});

router.post("/", addStudent);
router.get("/", getAllEntreprises);
router.post("/select", selectEntreprise);
router.get("/selected/:id_respo", getSelectedEntreprises);
module.exports = router;
