// Required modules ko import kar rahe hain
import express from "express";
import { dbConnection } from "./database/dbConnection.js"; // MongoDB se connect karne wala function
import { config } from "dotenv"; // Environment variables ko load karne ke liye
import cookieParser from "cookie-parser"; // Cookies ko read karne ke liye
import cors from "cors"; // CORS error handle karne ke liye
import fileUpload from "express-fileupload"; // File upload karne ke liye
import { errorMiddleware } from "./middlewares/error.js"; // Custom error middleware

// Alag-alag feature specific routers import kar rahe hain
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

// Express app initialize kar rahe hain
const app = express();

// .env file ko load kar rahe hain jisme sensitive info hoti hai (jaise DB URI, port, etc.)
config({ path: "./config/config.env" });

// CORS middleware setup kar rahe hain taaki frontend backend ke sath communicate kar sake
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


// Middleware to read cookies from requests
app.use(cookieParser());

// JSON body parse karne ke liye middleware (POST/PUT requests ke liye useful)
app.use(express.json());

// Form data ko URL-encoded format me accept karne ke liye (extended true matlab nested object bhi parse honge)
app.use(express.urlencoded({ extended: true }));

// File upload ka middleware setup kar rahe hain
app.use(
  fileUpload({
    useTempFiles: true, // Temporary files use honge upload ke dauraan
    tempFileDir: "/tmp/", // Temporary file save karne ka location
  })
);

// Routes define kar rahe hain — API ke endpoints
app.use("/api/v1/message", messageRouter); // Messages ke routes
app.use("/api/v1/user", userRouter); // Users ke routes
app.use("/api/v1/appointment", appointmentRouter); // Appointments ke routes

// MongoDB ke sath connection establish kar rahe hain
dbConnection();

// Agar koi bhi error aaye application me, to use handle karne ke liye custom error middleware use kar rahe hain
app.use(errorMiddleware);

// App ko export kar rahe hain taaki server.js ya index.js file me use ho sake
export default app;
