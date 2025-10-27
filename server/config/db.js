import mongoose from "mongoose";

const connectDB=async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("✅ Database connected Successfully!")
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/Resume_Builder`)
};
export default connectDB;