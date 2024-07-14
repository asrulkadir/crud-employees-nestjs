/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectRequest,
  ProjectResponse,
  UpdateProjectRequest,
} from 'src/model/project.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @HttpCode(200)
  async createProject(
    @Body() request: CreateProjectRequest,
  ): Promise<WebResponse<ProjectResponse>> {
    const result = await this.projectService.createProject(request);
    return {
      status: 'success',
      message: 'Project created',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getProjects(): Promise<WebResponse<ProjectResponse[]>> {
    const result = await this.projectService.getProjects();
    return {
      status: 'success',
      message: 'Projects found',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getProjectById(
    @Param('id') id: string,
  ): Promise<WebResponse<ProjectResponse>> {
    const result = await this.projectService.getProjectById(id);
    return {
      status: 'success',
      message: 'Project found',
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async updateProject(
    @Param('id') id: string,
    @Body() request: UpdateProjectRequest,
  ): Promise<WebResponse<ProjectResponse>> {
    const result = await this.projectService.updateProject(id, request);
    return {
      status: 'success',
      message: 'Project updated',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteProject(
    @Param('id') id: string,
  ): Promise<WebResponse<ProjectResponse>> {
    const result = await this.projectService.deleteProject(id);
    return {
      status: 'success',
      message: 'Project deleted',
      data: result,
    };
  }
}
