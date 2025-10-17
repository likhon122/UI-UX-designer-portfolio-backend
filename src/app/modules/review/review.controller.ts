import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createReviewHandler,
  deleteReviewHandler,
  getAllReviewsHandler,
  getSingleReviewHandler,
} from './review.service';

const createReview = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await createReviewHandler(req.body, userId);

  return successResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleReviewHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review fetched successfully',
    data: result,
  });
});

const getAllDesignReviews = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await getAllReviewsHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const role = req.user.role;

  await deleteReviewHandler(id, userId, role);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review deleted successfully',
    data: {},
  });
});

export { createReview, getSingleReview, getAllDesignReviews, deleteReview };
