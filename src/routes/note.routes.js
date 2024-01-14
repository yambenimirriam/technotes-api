import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/note.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createNote);
router.get('/', verifyToken, getAllNotes);
router.patch('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

export default router;
