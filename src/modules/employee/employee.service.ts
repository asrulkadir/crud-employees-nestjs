/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { EmployeeValidation } from './employee.validation';
import {
  CreateEmployeeRequest,
  EmployeeResponse,
  UpdateEmployeeRequest,
} from 'src/model/employee.model';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createEmployee(
    request: CreateEmployeeRequest,
  ): Promise<EmployeeResponse> {
    this.logger.debug(`createEmployee: request=${JSON.stringify(request)}`);

    const createRequest = this.validationService.validate(
      EmployeeValidation.CREATE,
      request,
    );

    // check if email already exists
    const existingEmployee = await this.prismaService.employee.findFirst({
      where: {
        email: createRequest.email,
      },
    });

    if (existingEmployee) {
      throw new HttpException('Employee email already exists', 400);
    }

    const department = await this.prismaService.department.findUnique({
      where: {
        id: createRequest.department_id,
      },
    });

    if (!department) {
      throw new HttpException('Department does not exist', 400);
    }

    const employee = await this.prismaService.employee.create({
      data: {
        ...createRequest,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return employee;
  }

  async getEmployees(): Promise<EmployeeResponse[]> {
    this.logger.debug('getEmployees');

    const employees = await this.prismaService.employee.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return employees;
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
    this.logger.debug(`getEmployee: employeeId=${employeeId}`);

    const employee = await this.prismaService.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!employee) {
      throw new HttpException('Employee not found', 404);
    }

    return employee;
  }

  async updateEmployee(
    request: UpdateEmployeeRequest,
  ): Promise<EmployeeResponse> {
    this.logger.debug(`updateEmployee: request=${JSON.stringify(request)}`);

    const updateRequest = this.validationService.validate(
      EmployeeValidation.UPDATE,
      request,
    );

    const employee = await this.prismaService.employee.findUnique({
      where: {
        id: updateRequest.id,
      },
    });

    if (!employee) {
      throw new HttpException('Employee not found', 404);
    }

    const updatedEmployee = await this.prismaService.employee.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedEmployee;
  }

  async deleteEmployee(employeeId: string): Promise<EmployeeResponse> {
    this.logger.debug(`deleteEmployee: employeeId=${employeeId}`);

    const employeeExists = await this.prismaService.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employeeExists) {
      throw new HttpException('Employee not found', 404);
    }

    const employee = await this.prismaService.employee.delete({
      where: {
        id: employeeId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return employee;
  }
}
