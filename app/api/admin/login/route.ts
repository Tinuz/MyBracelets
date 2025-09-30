import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Simple admin credentials for demo - in production, use proper user management
const ADMIN_CREDENTIALS = {
  email: 'admin@laninabracelets.com',
  password: 'admin123' // In production, use hashed passwords
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: 'admin@example.com', role: 'admin' as const },
      JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        email: email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}