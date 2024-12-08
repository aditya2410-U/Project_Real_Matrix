

import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type User = z.infer<typeof UserSchema> & {
  _id?: string;
  hashedPassword?: string;
};