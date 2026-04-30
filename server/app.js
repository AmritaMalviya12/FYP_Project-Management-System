import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./router/userRoutes.js";
import adminRouter from "./router/adminRoutes.js"
import studentRouters from "./router/studentRoutes.js"
import { errorMiddleware } from "./middlewares/error.js";
import { fileURLToPath } from "url"
import path from "path"
import { upload } from "./middlewares/upload.js";
import fs from "fs"
config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
})
);

const uploadsDir = path.join(__dirname, "uploads")
const tempDir = path.join(__dirname, "temp")

if(!fs.existsSync(uploadsDir)) {fs.mkdirSync(uploadsDir, {recursive : true})}
if(!fs.existsSync(tempDir)) {fs.mkdirSync(tempDir, {recursive : true});}


app.use(cookieParser());

// these two work together for some similar purpose . 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouters);

//for overall project error handling
//do not  call the error middleware here as errorMiddleware() as it will execute the same right now . 
app.use(errorMiddleware);

export default app;