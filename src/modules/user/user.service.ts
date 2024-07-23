/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';
import { CreateUserRequest, UserResponse } from 'src/model/user.model';

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

    // check if username already exists
    const existingUsername = await this.prismaService.user.findFirst({
      where: {
        username: createRequest.username,
      },
    });

    if (existingUsername) {
      throw new HttpException('User username already exists', 400);
    }

    // check if email already exists
    const existingEmail = await this.prismaService.user.findFirst({
      where: {
        email: createRequest.email,
      },
    });

    if (existingEmail) {
      throw new HttpException('User email already exists', 400);
    }

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
    };
  }
}
