/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateProjectRequest,
  ProjectResponse,
  UpdateProjectRequest,
} from 'src/model/project.model';
import { ProjectValidation } from './project.validation';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
    this.logger.debug(`createProject: request=${JSON.stringify(request)}`);
    const createRequest = this.validationService.validate(
      ProjectValidation.CREATE,
      request,
    );

    const employeesConnection = request.employees?.map((employeeId) => {
      return {
        id: employeeId,
      };
    });

    const project = await this.prismaService.project.create({
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
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return project;
  }

  async getProjects(): Promise<ProjectResponse[]> {
    const projects = await this.prismaService.project.findMany({
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return projects;
  }

  async getProjectById(id: string): Promise<ProjectResponse> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new HttpException('Project not found', 404);
    }

    return project;
  }

  async updateProject(
    id: string,
    request: UpdateProjectRequest,
  ): Promise<ProjectResponse> {
    this.logger.debug(`updateProject: request=${JSON.stringify(request)}`);
    const newRequest: UpdateProjectRequest = {
      ...request,
      id,
    };

    // check if the project exists
    const projectExists = await this.prismaService.project.findUnique({
      where: {
        id,
      },
    });

    if (!projectExists) {
      throw new HttpException('Project not found', 404);
    }

    const updateRequest = this.validationService.validate(
      ProjectValidation.UPDATE,
      newRequest,
    );

    const employeesConnection = newRequest.employees?.map((employeeId) => {
      return {
        id: employeeId,
      };
    });

    const project = await this.prismaService.project.update({
      where: {
        id,
      },
      data: {
        ...updateRequest,
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
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return project;
  }

  async deleteProject(id: string): Promise<ProjectResponse> {
    // check if the project exists
    const projectExists = await this.prismaService.project.findUnique({
      where: {
        id,
      },
    });

    if (!projectExists) {
      throw new HttpException('Project not found', 404);
    }

    const project = await this.prismaService.project.delete({
      where: {
        id,
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return project;
  }
}
