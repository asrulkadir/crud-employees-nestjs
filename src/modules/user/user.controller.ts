/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Public } from 'src/common/public.decorator';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  @HttpCode(200)
  async register(
    @Body() request: CreateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.createUser(request);
    return {
      status: 'success',
      message: 'User created',
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getUserByUsername(
    @Param('id') id: string,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.getUserByUsername(id);
    return {
      status: 'success',
      message: 'Users found',
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const updateRequest: UpdateUserRequest = {
      ...request,
      id,
    };
    const result = await this.userService.updateUser(id, updateRequest);
    return {
      status: 'success',
      message: 'User updated',
      data: result,
    };
  }
}
