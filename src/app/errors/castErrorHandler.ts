import { CastError } from 'mongoose';
import { TGenericErrorReturnType } from '../interface/error.interface';

const castErrorHandler = (err: CastError): TGenericErrorReturnType => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: "${err.value}". Please provide a valid ID.`,
    errorSources: [
      {
        path: err.path ? err.path : '',
        message: `Invalid value "${err.value}" for ${err.path}. Expected a valid ObjectId.`,
      },
    ],
  };
};

export default castErrorHandler;
