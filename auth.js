const jwt = require("jsonwebtoken");//jo jwt token create or verify krega


const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");//jwt token ko authorization header mei bhejta hai

    if (!token) {
        return res.status(401).json({ message: "No token provided!" });//incoming requests ko check krega agr error hai toh throw krega error
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""),process.env.SECRET_KEY);//replace("Bearer ", "") ka matlab hai "Bearer " prefix ko remove karna, kyunki header me token "Bearer <JWT_TOKEN>" format me aata hai.
        req.user = decoded;   // agar sahi hai toh decode variable mei token ki information ayegi
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token!" });
    }
};

module.exports = authMiddleware;  // token ko export krdia taki baki api s mei isse use kar ske
