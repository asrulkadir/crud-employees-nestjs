import { EDepartmentName } from 'src/enum/department.enum';
import { z, ZodType } from 'zod';

export class DepartmentValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.enum([
      EDepartmentName.IT,
      EDepartmentName.HR,
      EDepartmentName.Marketing,
      EDepartmentName.Sales,
      EDepartmentName.Security,
      EDepartmentName.Other,
    ]),
    description: z.string().min(1).max(100).optional(),
    employees: z.array(z.string().uuid()).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    name: z
      .enum([
        EDepartmentName.IT,
        EDepartmentName.HR,
        EDepartmentName.Marketing,
        EDepartmentName.Sales,
        EDepartmentName.Security,
        EDepartmentName.Other,
      ])
      .optional(),
    description: z.string().min(1).max(100).optional(),
    employees: z.array(z.string().uuid()).optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
