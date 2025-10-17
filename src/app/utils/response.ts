import { Response } from 'express';

type SuccessResponse = {
  success: true;
  message: string;
  statusCode: number;
  data: object | [] | string | number | boolean;
};

const successResponse = (
  res: Response,
  { success, message, statusCode, data }: SuccessResponse
) => {
  res.status(statusCode).send({
    success,
    message,
    data,
  });
};

export { successResponse };
