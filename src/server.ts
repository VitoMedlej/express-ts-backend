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
import { env } from "@/common/utils/envConfig";
import authenticateRequest from "./common/middleware/authHandler";
import { productsRouter } from "./api/products/productsRouter";
// import { connectToDatabase } from "./database/mongodbClient";
const morgan = require('morgan');
const fs = require('fs');



const logger = pino({ name: "server start" });
const app: Express = express();

const allowedOrigins = [
    'https://ecommerce-dashboard-template.vercel.app',
    `https://ecom-template-roan.vercel.app/`
  ];

// Set the application to trust the reverse proxy
app.set("trust proxy", true);


// Logs
const logStream = fs.createWriteStream('access.log', { flags: 'a' });
app.use(morgan('combined', { stream: logStream })); // Logs to file

// Also log to console
app.use(morgan('dev')); // Logs to console in 'dev' format


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: function (origin, callback) {
       
        if (!origin || allowedOrigins.includes(origin)) {
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
// connectToDatabase()
//   .then(() => {
//     console.log("MongoDB connection established.");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1); // Exit the process if DB connection fails
//   });


// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/products", productsRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
