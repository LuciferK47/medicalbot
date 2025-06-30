import { Request, Response } from 'express';
import HealthRecord from '../models/HealthRecord';
import User from '../models/User';
import fs from 'fs/promises';
import path from 'path';
import { summarizeText, analyzeImage } from '../services/geminiService';

interface AuthRequest extends Request {
  user?: User;
  file?: Express.Multer.File;
}

/**
 * @desc    Upload a health record
 * @route   POST /api/records/upload
 * @access  Private
 */
export const uploadRecord = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const newRecord = await HealthRecord.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      content: req.file.path, // For now, content stores the path
      status: 'pending',
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all health records for a user
 * @route   GET /api/records
 * @access  Private
 */
export const getRecords = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const records = await HealthRecord.findAll({ where: { userId: req.user.id } });
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single health record
 * @route   GET /api/records/:id
 * @access  Private
 */
export const getRecordById = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const record = await HealthRecord.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Ensure the record belongs to the user
    if (record.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Summarize a health record
 * @route   POST /api/records/:id/summarize
 * @access  Private
 */
export const summarizeRecord = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const record = await HealthRecord.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const filePath = path.join(__dirname, '..', '..', record.content);
    const fileExtension = path.extname(record.fileName).toLowerCase();
    const imageExtensions = ['.jpeg', '.jpg', '.png'];

    let summary: string;

    if (imageExtensions.includes(fileExtension)) {
      const prompt = 'Analyze this medical image and provide a detailed summary.';
      summary = await analyzeImage(filePath, prompt);
    } else {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      summary = await summarizeText(fileContent);
    }

    // Update the record with the summary
    record.summary = summary;
    record.status = 'completed';
    await record.save();

    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};