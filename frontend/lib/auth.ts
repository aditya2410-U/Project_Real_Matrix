import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(SECRET_KEY));
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(SECRET_KEY)
    );
    return payload.userId as string;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}