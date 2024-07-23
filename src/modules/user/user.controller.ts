/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
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
}
