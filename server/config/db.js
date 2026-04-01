import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "fyp_management_system",
    })
    .then(() => {
        console.log("connected with db.");
    })
    .catch((err) => {
        console.log("failed connecting with db.", err);
    })
};