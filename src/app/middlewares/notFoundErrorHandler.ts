/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/appError';

const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new AppError(
    404,
    'Page not found! Your lost your track. Check the URL.'
  );
};

export default notFoundErrorHandler;
