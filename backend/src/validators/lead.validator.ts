import { body } from 'express-validator';
import { LeadStatus, LeadSource } from '../types';

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage('Invalid status value'),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(Object.values(LeadSource)).withMessage('Invalid source value'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email'),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage('Invalid status value'),

  body('source')
    .optional()
    .isIn(Object.values(LeadSource)).withMessage('Invalid source value'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
];
