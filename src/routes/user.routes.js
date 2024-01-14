import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyAdmin, createUser);
router.get('/', verifyAdmin, getAllUsers);
router.patch('/:id', verifyAdmin, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);

export default router;
