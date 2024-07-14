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
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeRequest,
  EmployeeResponse,
  UpdateEmployeeRequest,
} from 'src/model/employee.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  @HttpCode(200)
  async createEmployee(
    @Body() request: CreateEmployeeRequest,
  ): Promise<WebResponse<EmployeeResponse>> {
    const result = await this.employeeService.createEmployee(request);
    return {
      status: 'success',
      message: 'Employee created',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getEmployees(): Promise<WebResponse<EmployeeResponse[]>> {
    const result = await this.employeeService.getEmployees();
    return {
      status: 'success',
      message: 'Employees found',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getEmployeeById(
    @Param('id') id: string,
  ): Promise<WebResponse<EmployeeResponse>> {
    const result = await this.employeeService.getEmployeeById(id);
    return {
      status: 'success',
      message: 'Employee found',
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async updateEmployee(
    @Param('id') id: string,
    @Body() request: UpdateEmployeeRequest,
  ): Promise<WebResponse<EmployeeResponse>> {
    request.id = id;
    const result = await this.employeeService.updateEmployee(request);
    return {
      status: 'success',
      message: 'Employee updated',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteEmployee(
    @Param('id') id: string,
  ): Promise<WebResponse<EmployeeResponse>> {
    const result = await this.employeeService.deleteEmployee(id);
    return {
      status: 'success',
      message: 'Employee deleted',
      data: result,
    };
  }
}
