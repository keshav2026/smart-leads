import { Response } from 'express';
import { stringify } from 'csv-stringify/sync';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, UserRole } from '../types';
import Lead from '../models/Lead';
import { sendSuccess, sendError } from '../utils/response';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

// ─── Build query filter ───────────────────────────────────────────────────────

const buildFilter = (
  query: LeadQueryParams,
  userId: string,
  role: UserRole
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  // Sales users only see their own leads
  if (role === UserRole.SALES) {
    filter.createdBy = userId;
  }

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
};

// ─── Get all leads ────────────────────────────────────────────────────────────

export const getLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as LeadQueryParams;
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '10', 10)));
    const skip = (page - 1) * limit;
    const sortOrder = query.sort === 'oldest' ? 1 : -1;

    const filter = buildFilter(query, req.user!.id, req.user!.role);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, 'Leads retrieved', leads, 200, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch {
    sendError(res, 'Failed to retrieve leads', 500);
  }
};

// ─── Get single lead ──────────────────────────────────────────────────────────

export const getLeadById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Forbidden', 403);
      return;
    }

    sendSuccess(res, 'Lead retrieved', lead);
  } catch {
    sendError(res, 'Failed to retrieve lead', 500);
  }
};

// ─── Create lead ──────────────────────────────────────────────────────────────

export const createLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body as {
      name: string;
      email: string;
      status?: LeadStatus;
      source: LeadSource;
      notes?: string;
    };

    const lead = await Lead.create({
      name,
      email,
      status: status ?? LeadStatus.NEW,
      source,
      notes,
      createdBy: req.user!.id,
    });

    sendSuccess(res, 'Lead created', lead, 201);
  } catch {
    sendError(res, 'Failed to create lead', 500);
  }
};

// ─── Update lead ──────────────────────────────────────────────────────────────

export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Forbidden', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, 'Lead updated', updated);
  } catch {
    sendError(res, 'Failed to update lead', 500);
  }
};

// ─── Delete lead ──────────────────────────────────────────────────────────────

export const deleteLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Forbidden', 403);
      return;
    }

    await lead.deleteOne();
    sendSuccess(res, 'Lead deleted');
  } catch {
    sendError(res, 'Failed to delete lead', 500);
  }
};

// ─── Export CSV ───────────────────────────────────────────────────────────────

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as LeadQueryParams;
    const filter = buildFilter(query, req.user!.id, req.user!.role);

    const leads = await Lead.find(filter)
      .populate<{ createdBy: { name: string; email: string } }>('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const rows = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      Notes: lead.notes ?? '',
      'Created By': lead.createdBy?.name ?? '',
      'Created At': new Date(lead.createdAt).toISOString().split('T')[0],
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch {
    sendError(res, 'Failed to export leads', 500);
  }
};
