/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { DepartmentValidation } from './department.validation';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateDepartmentRequest,
  DepartmentResponse,
  UpdateDepartmentRequest,
} from 'src/model/department.model';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createDepartment(
    request: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    this.logger.debug(`createDepartment: request=${JSON.stringify(request)}`);

    const createRequest = this.validationService.validate(
      DepartmentValidation.CREATE,
      request,
    );

    // check if department name already exists
    const existingDepartment = await this.prismaService.department.findFirst({
      where: {
        name: createRequest.name,
      },
    });

    if (existingDepartment) {
      throw new HttpException('Department name already exists', 400);
    }

    const employeesConnection = request.employees?.map((employeeId) => {
      return {
        id: employeeId,
      };
    });

    const department = await this.prismaService.department.create({
      data: {
        ...createRequest,
        employees: {
          connect: employeesConnection,
        },
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return department;
  }

  async updateDepartment(
    id: string,
    request: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    this.logger.debug(`updateDepartment: request=${JSON.stringify(request)}`);
    const newRequest = {
      id: id,
      ...request,
    };

    const updateRequest = this.validationService.validate(
      DepartmentValidation.UPDATE,
      newRequest,
    );

    // check if the department exists
    const departmentExists = await this.prismaService.department.findUnique({
      where: {
        id: id,
      },
    });

    if (!departmentExists) {
      throw new HttpException('Department not found', 404);
    }

    // check if department name already exists
    const existingDepartment = await this.prismaService.department.findFirst({
      where: {
        name: updateRequest.name,
      },
    });

    if (existingDepartment) {
      throw new HttpException('Department name already exists', 400);
    }

    const department = await this.prismaService.department.update({
      where: {
        id: id,
      },
      data: updateRequest,
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return department;
  }

  async getDepartments(): Promise<DepartmentResponse[]> {
    const departments = await this.prismaService.department.findMany({
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return departments;
  }

  async getDepartmentById(id: string): Promise<DepartmentResponse> {
    const department = await this.prismaService.department.findUnique({
      where: {
        id: id,
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!department) {
      throw new HttpException('Department not found', 404);
    }

    return department;
  }

  async deleteDepartment(id: string): Promise<DepartmentResponse> {
    // check if the department exists
    const departmentExists = await this.prismaService.department.findUnique({
      where: {
        id: id,
      },
    });

    if (!departmentExists) {
      throw new HttpException('Department not found', 404);
    }

    const department = await this.prismaService.department.delete({
      where: {
        id: id,
      },
    });

    return department;
  }
}
