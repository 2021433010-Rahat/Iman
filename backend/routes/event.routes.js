import express from "express"

const eventRouter = express.Router()

console.log('=== REGISTERING MINIMAL EVENT ROUTES ===');

// Simple test route to verify basic functionality
eventRouter.get("/test", (req, res) => {
    res.json({ 
        message: "Event routes working", 
        timestamp: new Date().toISOString(),
        status: "success"
    });
});

// Health check for events
eventRouter.get("/health", (req, res) => {
    res.json({ 
        service: "events",
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

export default eventRouter