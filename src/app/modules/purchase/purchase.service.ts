import mongoose, { Types } from 'mongoose';
import AppError from '../../errors/appError';
import Design from '../desing/design.model';
import PricingPlan from '../pricingPlan/pricingPlan.model';
import Purchase from './purchase.model';
import { TPurchase } from './purchase.types';
import { Customer } from '../customer/customer.model';

const createPurchaseHandler = async (
  payload: TPurchase,
  customerId: Types.ObjectId
) => {
  // Check if the user has already purchased the design with the same pricing plan and this is not ended
  const [existingPurchase, design, pricingPlan] = await Promise.all([
    Purchase.findOne({
      customer: customerId,
      design: payload.design,
      pricingPlan: payload.pricingPlan,
      paymentStatus: 'Paid',
    }),
    Design.findById(payload.design).select('isActive'),
    PricingPlan.findById(payload.pricingPlan).select('isActive duration'),
  ]);

  if (!design) {
    throw new AppError(404, 'Design not found. Please check the ID.');
  }

  if (!pricingPlan) {
    throw new AppError(404, 'Pricing plan not found. Please check the ID.');
  }

  // Check if the existing purchase is still valid based on the pricing plan duration
  if (existingPurchase) {
    const now = new Date();
    const purchaseDate = new Date(existingPurchase.purchaseDate);
    const expiryDate = new Date(
      purchaseDate.setDate(purchaseDate.getDate() + pricingPlan.duration)
    );

    // The existing purchase is still valid
    if (expiryDate > now) {
      throw new AppError(
        400,
        'You have already purchased this design with the same pricing plan and it is still valid.'
      );
    }
  }

  payload.purchaseDate = new Date();
  payload.customer = customerId;
  const purchase = await Purchase.create(payload);
  if (!purchase) {
    throw new AppError(500, 'Failed to create purchase. Please try again.');
  }
  return purchase;
};

const updatePurchaseHandler = async (
  id: string,
  payload: { paymentStatus: string }
) => {
  const { paymentStatus } = payload;
  const purchaseIsExists = await Purchase.findById(id);
  if (!purchaseIsExists) {
    throw new AppError(404, 'Purchase not found. Please check the ID.');
  }

  if (purchaseIsExists.paymentStatus === 'Cancelled') {
    throw new AppError(400, 'Cannot update a cancelled purchase.');
  }

  if (purchaseIsExists.paymentStatus === 'Paid') {
    throw new AppError(400, 'Purchase is already marked as Paid.');
  }

  const session = await mongoose.startSession();

  try {
    // Start Transaction
    session.startTransaction();
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      {
        paymentStatus,
      },
      {
        new: true,
        session,
      }
    );

    if (paymentStatus === 'Paid') {
      // Find the customer and update their totalSpent and membership based on the pricing plan
      const customer = await Customer.findOne({
        user: purchaseIsExists.customer,
      }).select('_id');

      if (!customer) {
        throw new AppError(404, 'Customer not found. Please check the ID.');
      }

      const purchaseDetails = await PricingPlan.findById(
        purchaseIsExists.pricingPlan
      ).select('price name');

      if (!purchaseDetails) {
        throw new AppError(404, 'Pricing plan not found. Please check the ID.');
      }

      if (!purchaseDetails.price || !purchaseDetails.name) {
        throw new AppError(
          500,
          'Pricing plan data is incomplete. Please check the pricing plan details.'
        );
      }

      const { price, name } = purchaseDetails;
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customer?._id,
        {
          $inc: { totalSpent: price },
          $set: { membership: name },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedCustomer) {
        throw new AppError(500, 'Failed to update customer. Please try again.');
      }
    }

    // Transaction is successful and commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return updatedPurchase as TPurchase;
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getSinglePurchaseHandler = async (
  id: string,
  role: string,
  userId: string
) => {
  const purchase = await Purchase.findById(id)
    .populate('design')
    .populate('pricingPlan');

  if (!purchase) {
    throw new AppError(404, 'Purchase not found. Please check the ID.');
  }

  if (role === 'customer' && purchase.customer.toString() !== userId) {
    throw new AppError(
      403,
      'You do not have permission to view this purchase.'
    );
  }

  return purchase;
};

const getAllMyPurchaseHandler = async (customerId: string) => {
  const purchases = await Purchase.find({ customer: customerId })
    .populate('design')
    .populate('pricingPlan');
  return purchases;
};

const getAllPurchasesHandler = async (query: {
  paymentStatus?: string;
  design?: string;
}) => {
  const filter: Record<string, unknown> = {};

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }
  if (query.design) {
    filter.design = query.design;
  }

  const purchases = await Purchase.find(filter)
    .populate('customer', 'name email')
    .populate('design')
    .populate('pricingPlan', 'name price duration');
  return purchases;
};

const getRevenueHandler = async () => {
  const result = await Purchase.aggregate([
    {
      $match: { paymentStatus: 'Paid' },
    },
    {
      $lookup: {
        from: 'pricing-plans',
        localField: 'pricingPlan',
        foreignField: '_id',
        as: 'pricingPlanDetails',
      },
    },
    {
      $unwind: '$pricingPlanDetails',
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricingPlanDetails.price' },
      },
    },
  ]);
  return result;
};

export {
  createPurchaseHandler,
  updatePurchaseHandler,
  getSinglePurchaseHandler,
  getAllMyPurchaseHandler,
  getAllPurchasesHandler,
  getRevenueHandler,
};
