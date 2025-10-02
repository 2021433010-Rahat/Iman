import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import eventRouter from "./routes/event.routes.js"
import userRouter from "./routes/user.routes.js"
import emailRouter from "./routes/email.routes.js"
import contactRouter from "./routes/contact.routes.js"
import proxyRouter from "./routes/proxy.routes.js"
import classroomRouter from "./routes/classroom.routes.js"
dotenv.config()

const app = express()

const port = process.env.PORT || 8000

// Enhanced CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, etc.)
            if (!origin) return callback(null, true);
            
            const allowedOrigins = [
                "http://localhost:3000",
                "http://localhost:3001", 
                "http://localhost:3002",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "https://eventure-hack-ai-4958.vercel.app",
                "https://frontend-dusky-nine-35.vercel.app",
                "https://frontend-p4uxkjbhu-abdullahs-projects-f95acc40.vercel.app",
                 process.env.FRONTEND_URL,

                "https://eventure-hack-ai.vercel.app",
                "https://eventure-hack-ai-git-main-minhaj47s-projects.vercel.app",
                "https://eventure-hack-ai-minhaj47s-projects.vercel.app"

            ].filter(Boolean);
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('CORS blocked origin:', origin);
                callback(null, true); // Allow all origins in development
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        optionsSuccessStatus: 200
    })
)
app.use(express.json())
app.use(cookieParser())

// Add a simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: port,
        env: process.env.NODE_ENV || 'development'
    });
});

// Add CORS preflight handler
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/event",eventRouter)
app.use("/api",emailRouter)
app.use("/api",contactRouter)
app.use("/api/proxy", proxyRouter)
app.use("/api", classroomRouter)

// Connect to database
connectDB()

// Start the server (Railway expects the app to always listen)
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS enabled for development and production`);
})

// For compatibility, also export the app
export default app