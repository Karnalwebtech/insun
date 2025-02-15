import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DB!)
        console.log("Database connected successfully ✅");
    } catch (err) {
        console.error("Database connection failed ❌", err);
        process.exit(1); // Exit process on failure
    }
}
export default dbconnect;