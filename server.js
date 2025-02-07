require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User"); // ✅ Import User Model
const authMiddleware = require("./auth"); // ✅ Import Middleware

const app = express();
app.use(express.json());

const mongoURI = "mongodb://127.0.0.1:27017/jwt_project"; 
mongoose.connect(process.env.URI)
    .then(() => console.log("🔥 MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));


const SECRET_KEY = "mysecretkey"; 

app.get("/", (req, res) => {
    res.send("Welcome to the Node.js API");
});

// ✅ MongoDB me user create karne ka API
app.post("/create-user", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required!" });
        }

        // ✅ Check if user already exists in MongoDB
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // ✅ Password Hashing & Save in MongoDB
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ MongoDB se login API
app.post("/login-user", async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ MongoDB se user find karo
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        // ✅ Password compare karo
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // ✅ JWT Token Generate Karo
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ JWT Token Validate Karne ka API
app.get("/validate-user", authMiddleware, (req, res) => {
    try {
        // ✅ If authMiddleware passes, token is valid
        res.json({ valid: true });
    } catch (error) {
        // ❌ If any error occurs, token is invalid
        res.status(401).json({ valid: false });
    }
});


app.listen(3000, () => console.log("🚀 Server running on port 3000"));
