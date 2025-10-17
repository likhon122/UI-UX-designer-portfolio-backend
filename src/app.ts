import express from 'express';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import notFoundErrorHandler from './app/middlewares/notFoundErrorHandler';
import globalErrorHandler from './app/errors/globalErrorHandler';
import cors from 'cors';

const app = express();

// Cors
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Middleware for parsing JSON, URL-encoded data and cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// All Routes are here in routes/index.ts
app.use('/api/v1', router);

// 404 Error Handling Middleware
app.use(notFoundErrorHandler);

// Global Error Handler can be added here
app.use(globalErrorHandler);
export default app;
