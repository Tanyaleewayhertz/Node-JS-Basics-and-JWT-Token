/Project
│-- /node_modules       # Installed packages
│-- /models
│   ├── User.js         # User schema (MongoDB)
│-- /middleware
│   ├── auth.js         # JWT Authentication middleware
│-- .env                # Environment variables (MongoDB URI, SECRET_KEY)
│-- server.js           # Main server file (Express APIs)
│-- package.json        # Project dependencies
🚀 Project Flow (Short Version)
1️⃣ User Signup (/create-user) → Username & Password MongoDB me save hota hai (hashed password ke saath).
2️⃣ User Login (/login-user) → Agar password sahi hai to JWT token milta hai.
3️⃣ User Validate (/validate-user) → Token headers me bhejna hota hai, agar valid hai to "Token is valid!" response milta hai.

🔹 Main Files Explanation
.env → MongoDB URI & JWT Secret key store karta hai.
User.js → User ka MongoDB Schema define karta hai.
auth.js → JWT token validate karne ka middleware hai.
server.js → APIs (create-user, login-user, validate-user) yahan likhi hain.
