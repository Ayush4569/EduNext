import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "MONGODB connected !! DB HOST:",
      connectionInstance.connection.name
    );
  } catch (error) {
    console.log("Error connecting database :", error);
    process.exit(1);
  }
};
