import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Unauthorized: No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Unauthorized: Invalid or expired token', 401);
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Forbidden: Insufficient permissions', 403);
      return;
    }
    next();
  };
};
