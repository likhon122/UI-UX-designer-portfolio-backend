import { Types } from 'mongoose';
import AppError from '../../errors/appError';
import { Customer } from './customer.model';

const getSingleCustomerHandler = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      400,
      'Customer ID is required to fetch a single customer.'
    );
  }
  const customer = await Customer.findById(id).populate('user', '-password');
  if (!customer) {
    throw new AppError(404, 'Customer not found. Please check the ID.');
  }
  return customer;
};

const getAllCustomersHandler = async (query: {
  page?: number;
  limit?: number;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const customers = await Customer.find()
    .skip(skip)
    .limit(limit)
    .populate('user', 'email role status isDeleted');
  return customers;
};

export { getSingleCustomerHandler, getAllCustomersHandler };
