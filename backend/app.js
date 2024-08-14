const express = require("express");
const cors = require("cors"); // Require the cors package

// Initialize the app
const app = express();

// Use CORS middleware
app.use(cors());

// MongoDB connection
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("/*Your MONGODB STRING */");
        console.log("Connected to DB");
    } catch (error) {
        mongoose.disconnect();
        process.exit(1);
    }
};

connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/auth", require("./auth.routes"));

// Start the server
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
