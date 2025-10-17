import { Router } from 'express';
import auth from '../../middlewares/auth';
import { getAllCustomers, getSingleCustomer } from './customer.controller';

const customerRoutes = Router();

customerRoutes.get('/', auth('admin', 'superAdmin'), getAllCustomers);
customerRoutes.get('/:id', auth('admin', 'superAdmin'), getSingleCustomer);
export default customerRoutes;
