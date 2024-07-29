/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    this.logger.debug(`createUser: request=${JSON.stringify(request)}`);
    const createRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );

    await this.checkIfExists('username', createRequest.username);
    await this.checkIfExists('email', createRequest.email);

    createRequest.password = await bcrypt.hash(createRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...createRequest,
      },
    });

    return {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getUserByUsername(username: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async updateUser(
    userId: string,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (updateRequest.username) {
      await this.checkIfExists('username', updateRequest.username);
    }

    if (updateRequest.email) {
      await this.checkIfExists('email', updateRequest.email);
    }

    if (updateRequest.password) {
      updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateRequest,
    });

    return {
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    };
  }

  async checkIfExists(property: 'username' | 'email', value: string) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        [property]: value,
      },
    });

    if (existingUser) {
      throw new HttpException(`User ${property} already exists`, 400);
    }
  }
}
