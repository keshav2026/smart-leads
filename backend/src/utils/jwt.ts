import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types';

export const generateToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): IUserPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, secret) as IUserPayload;
};
