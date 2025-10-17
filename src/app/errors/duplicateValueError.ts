/* eslint-disable @typescript-eslint/no-explicit-any */
const duplicateValueError = (err: any) => {
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];

  return {
    statusCode: 409,
    message: `Duplicate value for field "${duplicateField}": "${duplicateValue}". Please use another value.`,
    errorSources: [
      {
        path: '',
        message: `The ${duplicateField} ${duplicateValue} is already registered.`,
      },
    ],
  };
};

export default duplicateValueError;
