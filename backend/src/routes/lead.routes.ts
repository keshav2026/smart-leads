import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { protect, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(protect);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);
router.post('/', createLeadValidator, validate, createLead);
router.put('/:id', updateLeadValidator, validate, updateLead);
router.delete('/:id', requireRole(UserRole.ADMIN), deleteLead);

export default router;
