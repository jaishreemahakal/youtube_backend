import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URL}/
            ${DB_NAME}`);
        console.log(`\nMongoDB connected!! DB host: ${connectioninstance.connection.host}`);   
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
        
    }
};

export default connectDB;
