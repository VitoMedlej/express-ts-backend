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
const morgan = require('morgan');
const fs = require('fs');


const logger = pino({ name: "server start" });
const app: Express = express();

const allowedOrigins = [
    'http://localhost:8080/',
    'http://localhost:3000/',
    `https://ecommerce-dashboard-template.vercel.app/`,
    'https://millionairebia.com/',
  ];

// Set the application to trust the reverse proxy
app.set("trust proxy", true);


// Create a writable stream for logging to a file
const logFilePath = path.join(__dirname, "logs", "combined.log");
const logDir = path.dirname(logFilePath);

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  logStream.write(args.map(String).join(" ") + "\n");
};

// Log HTTP requests using Morgan
app.use(morgan("combined", { stream: logStream }));

console.log(`Logs will be saved to: ${logFilePath}`);


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: function (origin, callback) {
       
        if ( process.env.NODE_ENV === 'development' ||  !origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
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


// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/dashboard", dashboardRouter);

// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
