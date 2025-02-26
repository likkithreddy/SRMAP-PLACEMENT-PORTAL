import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // Assuming "User" is your model
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
        // console.log(decoded);
        
        req.user = await userModel.findById(decoded.id).select("-password"); // Attach user data to request

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid token, authorization denied" });
    }
};

 const verifyRecruiter = (req, res, next) => {
    
    if (!req.user || req.user.role !== "recruiter") {
        return res.status(403).json({ message: "Access denied. Recruiter only." });
    }
    next();
};


export { authenticateUser,verifyRecruiter };
