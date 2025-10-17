import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createPurchaseHandler,
  getAllMyPurchaseHandler,
  getAllPurchasesHandler,
  getRevenueHandler,
  getSinglePurchaseHandler,
  updatePurchaseHandler,
} from './purchase.service';

const createPurchase = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const result = await createPurchaseHandler(req.body, customerId);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Purchase created successfully',
    data: result,
  });
});

const updatePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updatePurchaseHandler(id, req.body);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Purchase updated successfully',
    data: result,
  });
});

const getSinglePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const result = await getSinglePurchaseHandler(id, role, userId);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Purchase fetched successfully',
    data: result,
  });
});

const getAllMyPurchase = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const result = await getAllMyPurchaseHandler(customerId);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Purchases fetched successfully',
    data: result,
  });
});

const getAllPurchases = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await getAllPurchasesHandler(query);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All purchases fetched successfully',
    data: result,
  });
});

const getRevenue = catchAsync(async (req, res) => {
  const result = await getRevenueHandler();
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Revenue fetched successfully',
    data: result,
  });
});

export {
  createPurchase,
  updatePurchase,
  getSinglePurchase,
  getAllMyPurchase,
  getAllPurchases,
  getRevenue,
};
