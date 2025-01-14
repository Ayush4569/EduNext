import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
        console.log("MONGODB conneced !! DB HOST: ",connectionInstance.connection.name);
    } catch (error) {
        console.log("Error connecting datase :",error);
        process.exit(1)
    }
}