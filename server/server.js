const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/dbConfig");
const adminRoutes = require("./routes/adminRoutes");
const respoRoutes = require("./routes/respoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const entrepriseRoutes = require("./routes/entrepriseRoutes");
const cvRoutes = require("./routes/cvRoutes");
const ecoleRoutes = require("./routes/ecoleRoutes");

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

// Routes
app.use("/api/admins", adminRoutes);
app.use("/api/respo", respoRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/entreprise", entrepriseRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/ecole", ecoleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
