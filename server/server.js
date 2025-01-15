const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDb = require("./config/dbConfig");
const adminRoutes = require("./routes/adminRoutes");
const respoRoutes = require("./routes/respoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const entrepriseRoutes = require("./routes/entrepriseRoutes");
const cvRoutes = require("./routes/cvRoutes");
const ecoleRoutes = require("./routes/ecoleRoutes");
const etudiantRoutes = require("./routes/etudiantRoutes");
const offerRoutes = require("./routes/offerRoutes");
const app = express();
const PORT = 3000;

app.use(express.json());


// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));


// Connect to Oracle DB
connectToDb();
const uploadsDir = path.join(__dirname, '..', 'uploads', 'cvis'); // Go up one directory
app.use('/uploads/cvis', (req, res, next) => {
  console.log('Request for CV:', req.url);
  next(); // Important: Call next() to continue processing
}, express.static(uploadsDir));
app.get('/uploads/cvis/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(filePath);
});
// Routes
app.use("/api/admins", adminRoutes);
app.use("/api/respo", respoRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/entreprise", entrepriseRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/ecole", ecoleRoutes);
app.use("/api/etudiant", etudiantRoutes);
app.use("/api/offers", offerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
