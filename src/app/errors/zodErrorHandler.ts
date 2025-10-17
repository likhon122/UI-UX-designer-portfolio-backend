import { ZodError } from 'zod';
import { TGenericErrorReturnType } from '../interface/error.interface';

const zodErrorHandler = (err: ZodError): TGenericErrorReturnType => {
  const zodErrors = err.issues.map(e => ({
    path: e.path?.join('.') || '',
    message: e.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources: zodErrors,
  };
};

export default zodErrorHandler;
