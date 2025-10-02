import mongoose from "mongoose"

const connectDB = async () => {
    try{
        if (!process.env.MONGODB_URL) {
            console.log("WARNING: MONGODB_URL not found in environment variables")
            console.log("Server will start without database connection")
            return
        }
        
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 10000, // Reduce timeout
            socketTimeoutMS: 15000,
            connectTimeoutMS: 10000,
            maxPoolSize: 5,
            retryWrites: true,
            retryReads: true
        })
        console.log("✅ Database connected successfully")
    }
    catch(error){
        console.log("❌ Database connection error:", error.message)
        console.log("⚠️  Server will continue without database connection")
        // Don't retry automatically to prevent blocking server startup
    }
}

export default connectDB;