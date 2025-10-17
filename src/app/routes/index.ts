import { Router } from 'express';
import categoryRoutes from '../modules/category/category.routes';
import designRoutes from '../modules/desing/design.routes';
import authRoutes from '../modules/auth/auth.routes';
import pricingPlanRoutes from '../modules/pricingPlan/pricingPlan.routes';
import purchaseRoutes from '../modules/purchase/purchase.routes';
import reviewRoutes from '../modules/review/review.routes';
import adminRoutes from '../modules/admin/admin.routes';
import userRoutes from '../modules/user/user.routes';
import customerRoutes from '../modules/customer/customer.routes';

const router = Router();

const routeModules = [
  {
    path: '/auth',
    router: authRoutes,
  },
  {
    path: '/categories',
    router: categoryRoutes,
  },
  {
    path: '/designs',
    router: designRoutes,
  },
  {
    path: '/pricing-plans',
    router: pricingPlanRoutes,
  },
  {
    path: '/purchase',
    router: purchaseRoutes,
  },
  {
    path: '/reviews',
    router: reviewRoutes,
  },
  {
    path: '/admins',
    router: adminRoutes,
  },
  {
    path: '/users',
    router: userRoutes,
  },
  {
    path: '/customers',
    router: customerRoutes,
  },
];

routeModules.forEach(module => router.use(module.path, module.router));

export default router;
