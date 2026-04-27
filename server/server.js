import app from "./app.js";
import connectDB from "./config/db.js";
// import {config} from "dotenv";

// config()
// database connection
connectDB();

//starting server
const PORT = process.env.PORT || 4000;
const server =app.listen(PORT, () => {
    console.log("server is running on port : " , PORT);
});

//error handling for server
process.on("unhandledRejection", (err) => {
    console.error(`unhandeled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
    console.error(`uncaught Exception: ${err.message}`);
    process.exit(1);
});



export default server;