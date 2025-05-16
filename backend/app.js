const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stockRouter = require("./routes/stockRoutes");
const userrouter = require("./routes/UserRoutes");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/stocks", stockRouter);
app.use("/users", userrouter);

// Error handling middleware (add this after your routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

mongoose
  .connect(
    "mongodb+srv://pathumgunasekara18:933PyvRoWmqZa45f@clusteracademic.4bote2z.mongodb.net/"
  )
  .then(() => {
    console.log("✅ MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔗 http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("❌ MongoDB connection failed:", err));
