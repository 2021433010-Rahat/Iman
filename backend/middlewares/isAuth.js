import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
    try {
        console.log('=== AUTH MIDDLEWARE CALLED ===');
        console.log('Request URL:', req.url);
        console.log('Request Method:', req.method);
        console.log('Cookies present:', Object.keys(req.cookies || {}).length > 0);
        
        const token = req.cookies.token 
        
        if (!token) {
            console.log('❌ No token found in cookies');
            console.log('Available cookies:', Object.keys(req.cookies || {}));
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided.",
                hint: "Please login again to get a valid authentication token"
            })
        }

        console.log('✅ Token found, verifying...');
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        console.log('✅ Token verified successfully, User ID:', verifyToken.userId);
        
        // Verify user still exists
        const user = await User.findById(verifyToken.userId).select("-password")
        
        if (!user) {
            console.log('❌ User not found in database:', verifyToken.userId);
            return res.status(401).json({ 
                success: false,
                message: "Access denied. User not found.",
                hint: "The user account associated with this token no longer exists"
            })
        }

        console.log('✅ User authenticated:', user.email);
        req.userId = verifyToken.userId
        req.user = user
        
        next()
        
    } catch (err) {
        console.error("=== AUTH MIDDLEWARE ERROR ===");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token.",
                hint: "The authentication token is malformed. Please login again."
            })
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token expired.",
                hint: "Your session has expired. Please login again."
            })
        } else {
            return res.status(500).json({ 
                success: false,
                message: "Authentication error",
                error: err.message
            })
        }
    }
}

export default isAuth