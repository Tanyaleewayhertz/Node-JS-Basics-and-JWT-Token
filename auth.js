const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey"; // Securely store in .env

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token!" });
    }
};

module.exports = authMiddleware;
