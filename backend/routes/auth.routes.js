import express from "express"

const authRouter = express.Router()

// Simple test routes to verify auth endpoints work
authRouter.get("/test", (req, res) => {
    res.json({ 
        message: "Auth routes working", 
        timestamp: new Date().toISOString(),
        status: "success"
    });
});

authRouter.get("/health", (req, res) => {
    res.json({ 
        service: "auth",
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

export default authRouter