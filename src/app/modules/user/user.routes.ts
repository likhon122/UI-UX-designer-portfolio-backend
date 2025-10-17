import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  getAllUsers,
  getMe,
  getSingleUser,
  updateUser,
} from './user.controller';

const userRoutes = Router();

userRoutes.get('/me', auth('admin', 'customer', 'superAdmin'), getMe);
userRoutes.get('/:id', auth('admin', 'superAdmin'), getSingleUser);
userRoutes.get('/', auth('admin', 'superAdmin'), getAllUsers);
userRoutes.patch('/:id', auth('admin', 'customer'), updateUser);

export default userRoutes;
