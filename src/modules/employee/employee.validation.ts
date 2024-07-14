import { EEmployeePosition } from 'src/enum/employee.enum';
import { z, ZodType } from 'zod';

export class EmployeeValidation {
  static readonly CREATE: ZodType = z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
    department_id: z.string().uuid(),
    position: z.enum([
      EEmployeePosition.Accountant,
      EEmployeePosition.Designer,
      EEmployeePosition.Developer,
      EEmployeePosition.HR,
      EEmployeePosition.Manager,
      EEmployeePosition.Marketing,
      EEmployeePosition.Other,
      EEmployeePosition.Sales,
      EEmployeePosition.Security,
      EEmployeePosition.Tester,
    ]),
    salary: z.number().int().positive().optional(),
    number_phone: z.string().min(1).max(100).optional(),
    address: z.string().min(1).max(100).optional(),
    projects: z.array(z.string().uuid()).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    name: z.string().min(1).max(100).optional(),
    department: z.string().uuid().optional(),
    position: z
      .enum([
        EEmployeePosition.Accountant,
        EEmployeePosition.Designer,
        EEmployeePosition.Developer,
        EEmployeePosition.HR,
        EEmployeePosition.Manager,
        EEmployeePosition.Marketing,
        EEmployeePosition.Other,
        EEmployeePosition.Sales,
        EEmployeePosition.Security,
        EEmployeePosition.Tester,
      ])
      .optional(),
    salary: z.number().int().positive().optional(),
    number_phone: z.string().min(1).max(100).optional(),
    address: z.string().min(1).max(100).optional(),
    projects: z.array(z.string().uuid()).optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
