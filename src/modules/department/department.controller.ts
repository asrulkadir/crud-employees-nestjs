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
import { DepartmentService } from './department.service';
import {
  CreateDepartmentRequest,
  DepartmentResponse,
  UpdateDepartmentRequest,
} from 'src/model/department.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  @HttpCode(200)
  async createDepartment(
    @Body() request: CreateDepartmentRequest,
  ): Promise<WebResponse<DepartmentResponse>> {
    const result = await this.departmentService.createDepartment(request);
    return {
      status: 'success',
      message: 'Department created',
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async updateDepartment(
    @Param('id') id: string,
    @Body() request: UpdateDepartmentRequest,
  ): Promise<WebResponse<DepartmentResponse>> {
    const result = await this.departmentService.updateDepartment(id, request);
    return {
      status: 'success',
      message: 'Department updated',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getDepartments(): Promise<WebResponse<DepartmentResponse[]>> {
    const result = await this.departmentService.getDepartments();
    return {
      status: 'success',
      message: 'Departments retrieved',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getDepartmentById(
    @Param('id') id: string,
  ): Promise<WebResponse<DepartmentResponse>> {
    const result = await this.departmentService.getDepartmentById(id);
    return {
      status: 'success',
      message: 'Department retrieved',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteDepartment(
    @Param('id') id: string,
  ): Promise<WebResponse<DepartmentResponse>> {
    const result = await this.departmentService.deleteDepartment(id);
    return {
      status: 'success',
      message: 'Department deleted',
      data: result,
    };
  }
}
