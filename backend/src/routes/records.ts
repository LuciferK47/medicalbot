import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadRecord,
  getRecords,
  getRecordById,
  summarizeRecord,
} from '../controllers/recordsController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Protect all routes in this file
router.use(protect);

router.post('/upload', upload.single('record'), uploadRecord);
router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/:id/summarize', summarizeRecord);

export default router;