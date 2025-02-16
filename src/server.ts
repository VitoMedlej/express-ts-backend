import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import authenticateRequest from "./common/middleware/authHandler";
import { productsRouter } from "./api/products/productsRouter";
// import { connectToDatabase } from "./database/mongodbClient";
import path from "path";
import { connectToDatabase } from "./database/mongodbClient";
import { dashboardRouter } from "./api/dashboard/dashboardRouter";
import { orderRouter } from "./api/order/orderRouter";
const morgan = require('morgan');
const fs = require('fs');




const app: Express = express();

// Configure Pino Logger
const logFilePath = path.join(process.cwd(), "logs", "combined.log");
const errorLogFilePath = path.join(process.cwd(), "logs", "errors.log");
const logDir = path.dirname(logFilePath);

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = pino({
  level: "info",
  transport: process.env.NODE_ENV === "development"
    ? { target: "pino-pretty" } // Pretty logs for development
    : undefined, // Default JSON logs for production
}, pino.destination(logFilePath)); // Combined logs

// Create writable stream for error logs
const errorLogStream = fs.createWriteStream(errorLogFilePath, { flags: "a" });

 console.log = (...args) => {
  logger.info(...args); // Redirect console.log to logger
};

// Log HTTP requests using Morgan, writing to combined log file
app.use(morgan("combined", { stream: fs.createWriteStream(logFilePath, { flags: "a" }) }));

// Middleware to capture errors and write to error log
app.use((err: { message: any; }, req: any, res: any, next: (arg0: any) => void) => {
  logger.error(err.message);
  errorLogStream.write(`${new Date().toISOString()} - ${err.message}\n`);
  next(err);
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:8080/",
  "http://localhost:3000/",
  "https://ecom-template-roan.vercel.app/",
  "https://ecommerce-dashboard-template.vercel.app/",
  "https://ecommerce-dashboard-template.vercel.app",
  "https://millionairebia.com/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "development" || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Helmet for basic security
app.use(helmet());

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Notify where logs are saved
logger.info(`Logs will be saved to: ${logFilePath}`);
logger.info(`Error logs will be saved to: ${errorLogFilePath}`);

export { app, logger };


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Add DELETE and OPTIONS methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Add headers that you are sending
    credentials: true,
  })
);
app.use(helmet());
app.use(rateLimiter);
app.use(authenticateRequest)
// Request logging
app.use(requestLogger);

// connect to db
connectToDatabase()
  .then(() => {
    console.log("MongoDB connection established.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if DB connection fails
  });


  app.options('*', cors());

  app.options("/api/*", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204); // No content, but preflight is successful
  });
// Routes

app.use("/api/health-check", healthCheckRouter);


app.get("/a25.mp4", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "a25.mp4"));
});

app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);



// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

