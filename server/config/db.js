import mongoose from "mongoose";
const connectDB = async () => {
        await mongoose.connect(process.env.MONGO_URI ,{
            dbName: "fyp_management_system",
        })
        .then(() => {
            console.log("connected with db.");
        })
        .catch((err) => {
            console.log("failed connecting with db.", err);
        })

}

export default connectDB;