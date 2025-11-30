import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { loginDto, SignupDto } from './auth_dto/signup.dto';
import { CheckPasswordPipe } from '../common/pipes/checkPassword.pipe';
import { ZodValidationPipe } from '../common/pipes/zod.pip';
import { loginSchema, signupSchema } from './authValidation/signup.zod';
import { AuthGuard, type AuthRequest } from '../common/guards/auth.guard';
import { LoggerInterceptor } from '../common/interceptors/logger.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema), new CheckPasswordPipe())
  async signup(@Body() data: SignupDto) {
    return await this.authService.signup(data);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() data: loginDto) {
    return await this.authService.login(data);
  }

  @Post('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggerInterceptor)
  async test(@Req() req:AuthRequest){
    return {
        data:req.user,
        status: 201
    };
  }
}
