import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  getAllCustomersHandler,
  getSingleCustomerHandler,
} from './customer.service';

const getSingleCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleCustomerHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer fetched successfully',
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req, res) => {
  const result = await getAllCustomersHandler(req.query);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customers fetched successfully',
    data: result,
  });
});

export { getSingleCustomer, getAllCustomers };
