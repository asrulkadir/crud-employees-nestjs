import { z, ZodType } from 'zod';

export class ProjectValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    employees: z.array(z.string().uuid()).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(100).optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    employees: z.array(z.string().uuid()).optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
