/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { TErrorSource } from '../interface/error.interface';
import { success, ZodError } from 'zod';
import zodErrorHandler from './zodErrorHandler';
import duplicateValueError from './duplicateValueError';
import castErrorHandler from './castErrorHandler';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources: TErrorSource[] = [
    {
      path: '',
      message: err.message || 'Something went wrong!',
    },
  ];

  let stack: string =
    'Error: ' +
    (err.stack?.split('\n')[1]?.trim() || 'No stack trace available');

  // Handle ZodError (validation error)

  if (err instanceof ZodError) {
    const zodError = zodErrorHandler(err);
    const formatedTrack = err.stack
      ? err.stack
          .split('\n')
          .filter(line => line.includes('e-commerce'))
          .map(line => line.trim())
          .join('\n')
      : 'No stack trace available';

    statusCode = zodError.statusCode;
    message = zodError.message;
    errorSources = zodError.errorSources;
    stack = formatedTrack;

    // Handle CastError (Mongoose bad ObjectId)
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    const castError = castErrorHandler(err);

    statusCode = castError.statusCode;
    message = castError.message;
    errorSources = castError.errorSources;

    // Handle Duplicate Key Error (MongoError with code 11000)
  } else if (err.code === 11000) {
    const duplicateError = duplicateValueError(err);

    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
    errorSources = duplicateError.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack,
  });
};

export default globalErrorHandler;
