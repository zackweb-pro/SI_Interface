const app = require('./app'); // Import application logic
const connectToDatabase = require('./config/db'); // Import database connection
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
