import { Response } from 'express';
import { AuthRequest, UserRole } from '../types';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      sendError(res, 'Email already in use', 409);
      return;
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(
      res,
      'Registration successful',
      {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      201
    );
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 'Login successful', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    sendError(res, 'Login failed', 500);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, 'User retrieved', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch {
    sendError(res, 'Failed to get user', 500);
  }
};
