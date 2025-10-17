import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getAllDesignReviews,
  getSingleReview,
} from './review.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createReviewSchemaValidation } from './review.validation';

const reviewRoutes = Router();

reviewRoutes.post(
  '/',
  auth('customer'),
  validateRequest(createReviewSchemaValidation),
  createReview
);

reviewRoutes.get('/design-reviews/:id', getAllDesignReviews);
reviewRoutes.get('/:id', getSingleReview);
reviewRoutes.delete('/:id', auth('admin', 'superAdmin'), deleteReview);

export default reviewRoutes;
