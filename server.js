require("dotenv").config();//.env se variables load karne ke liye
const express = require("express");//Express se api bnane ke liye
const mongoose = require("mongoose");//database se connect karne ke liye
const bcrypt = require("bcryptjs");//password ko securely hash karne ke liye 
const jwt = require("jsonwebtoken");//JWT token ko generate karne ke liye tak verify kar sake
const User = require("./User"); // Database mei user ka structure define krega
const authMiddleware = require("./auth"); // JWT validation ke liye ye middleware hai

const app = express(); //express app bnaya hai
app.use(express.json());//requests ko json format mei read karne ke liye

const mongoURI = "mongodb://127.0.0.1:27017/jwt_project"; 
mongoose.connect(process.env.URI) //mongodb se connection setup karne ke liye
    .then(() => console.log("MongoDB Connected Successfully!"))// agar successful hua toh ye ayega
    .catch((err) => console.log("MongoDB Connection Error:", err));// error aya toh ye ayega


 

app.get("/", (req, res) => {
    res.send("Welcome to the Node.js API");
}); // ye hamne basic route bnaya hai taki ek message return kr sake

app.post("/create-user", async (req, res) => {
    try {
        const { username, password } = req.body; // Post request user create karega 

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required!" });
        }

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" }); // agar error ya user already hai toh message return karega
        }

        //
        const hashedPassword = await bcrypt.hash(password, 10); // ye password ki hashing kar rha hai
        const newUser = new User({ username, password: hashedPassword });// jo nya user created hai usse database mei save kar rha hai
        await newUser.save();// new user mongodb mei save hojaega

        res.status(201).json({ message: "User created successfully!" });  //successful honr par ye message ayega
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Post request hai jo user ko login krega
app.post("/login-user", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Ye user ko database mei find krega
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        // Bycrypt wale message se comapare krega 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // ye JWT token generate krra hai
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) { // agar sab sahi hua toh user ko token return karega
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" }); // vsrns error throw krega
    }
});

// ✅ JWT Token Validate Karne ka API
app.get("/validate-user", authMiddleware, (req, res) => {
    try {
        // If authMiddleware passes, token is valid
        res.json({ valid: true }); //agar token valid hai toh true
    } catch (error) {
        // agar false hai toh ye
        res.status(401).json({ valid: false });
    }
});


app.listen(3000, () => console.log("🚀 Server running on port 3000"));
