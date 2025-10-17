import { Types } from 'mongoose';
import AppError from '../../errors/appError';
import Review from './review.model';
import { TReview } from './review.types';
import Design from '../desing/design.model';
import Purchase from '../purchase/purchase.model';
import { UserRole } from '../user/user.types';
import { Customer } from '../customer/customer.model';

const createReviewHandler = async (
  payload: TReview,
  userId: Types.ObjectId
) => {
  const existingReview = await Review.findOne({
    reviewer: userId,
    design: payload.design,
  });

  if (existingReview) {
    throw new AppError(400, 'You have already reviewed this design.');
  }
  // Check if the Design is valid by checking the design ID and if the user has purchased it
  const [designExists, purchaseExists] = await Promise.all([
    Design.findById(payload.design).select('_id'),
    Purchase.findOne({
      design: payload.design,
      customer: userId,
      paymentStatus: 'Paid',
    }),
  ]);

  if (!designExists) {
    throw new AppError(404, 'Design not found. Please check the ID.');
  }
  if (!purchaseExists) {
    throw new AppError(
      400,
      'You can only review designs that you have purchased. Please purchase the design before leaving a review.'
    );
  }

  payload.reviewer = userId;

  const review = await Review.create(payload);
  if (!review) {
    throw new AppError(500, 'Failed to create review. Please try again.');
  }

  const customerDetails = await Customer.findOne({
    user: review.reviewer,
  }).select('name profileImage');

  return {
    ...review.toObject(),
    customerDetails,
  };
};

const getSingleReviewHandler = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Review ID is required to fetch a single review.');
  }

  const review = await Review.findById(id)
    .populate('reviewer', 'email')
    .populate('design', 'title previewImageUrl category price complexityLevel');

  if (!review) {
    throw new AppError(404, 'Review not found. Please check the ID.');
  }

  const customerDetails = await Customer.findOne({
    user: review.reviewer._id,
  }).select('name profileImage');

  return {
    ...review.toObject(),
    customerDetails,
  };
};

const getAllReviewsHandler = async (designId: string) => {
  if (!designId) {
    throw new AppError(400, 'Design ID is required to fetch reviews.');
  }

  const reviews = await Review.find({ design: designId })
    .populate('reviewer', 'email')
    .populate('design', 'title previewImageUrl category price complexityLevel');

  const allCustomerDetails = await Promise.all(
    reviews.map(async review => {
      const customerDetails = await Customer.findOne({
        user: review.reviewer._id,
      }).select('name profileImage');

      return {
        ...review.toObject(),
        customerDetails,
      };
    })
  );

  return allCustomerDetails;
};

const deleteReviewHandler = async (
  id: string,
  userId: string,
  role: UserRole
) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError(404, 'Review not found. Please check the ID.');
  }

  if (
    role !== 'superAdmin' &&
    role !== 'admin' &&
    review.reviewer.toString() !== userId
  ) {
    throw new AppError(
      403,
      'You do not have permission to delete this review.'
    );
  }

  const deletedReview = await Review.findByIdAndDelete(id);
  if (!deletedReview) {
    throw new AppError(500, 'Failed to delete review. Please try again.');
  }
};

export {
  createReviewHandler,
  getSingleReviewHandler,
  getAllReviewsHandler,
  deleteReviewHandler,
};
