import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface AdminUser {
  email: string;
  role: 'admin';
  iat: number;
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function isValidAdminRequest(authHeader: string | null): AdminUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyAdminToken(token);
}