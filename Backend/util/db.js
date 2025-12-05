import mongoose from "mongoose";

const connectdb = async () => { 
    try{
        console.log("Connecting to mongodb...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected successfully");
    }catch(error){
        console.error("Mongodb connection failed:", error.message);
    }
}

export default connectdb;