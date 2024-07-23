import { EUserRole } from 'src/enum/user.enum';
import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.enum([EUserRole.Admin, EUserRole.User]),
    username: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    role: z.enum([EUserRole.Admin, EUserRole.User]).optional(),
    username: z.string().min(1).max(100).optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
