import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./router/userRoutes.js";
import adminRouter from "./router/adminRoutes.js"
import { errorMiddleware } from "./middlewares/error.js";


config();
const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
})
);

app.use(cookieParser());

// these two work together for some similar purpose . 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

//for overall project error handling
//do not  call the error middleware here as errorMiddleware() as it will execute the same right now . 
app.use(errorMiddleware);

export default app;