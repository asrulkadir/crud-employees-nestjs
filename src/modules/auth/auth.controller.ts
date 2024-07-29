/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from 'src/model/auth.model';
import { Public } from 'src/common/public.decorator';
import { Response } from 'express'; // Import the Response type from 'express'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() request: LoginRequest,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.signIn(request);
    // set cookie
    res.cookie('auth', result.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
      secure: true,
    });
    res.send({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  }
}
