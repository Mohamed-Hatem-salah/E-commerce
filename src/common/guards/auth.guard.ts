import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Model } from 'mongoose';
import { HydratedUser } from '../../types/user.type';

export interface AuthRequest extends Request {
  user: HydratedUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AuthRequest = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (!authorization || !authorization?.startsWith('Bearer')) {
      throw new BadRequestException('in-valed token');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('in-valed token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.TOKEN_SECRET as string,
      });

      const user = await this.userModel
        .findById(payload._id)
        .select('-password');
      if (!user) throw new BadRequestException('invalid token');

      req.user = user;
      return true;
    } catch (err) {
      throw new BadRequestException('invalid token');
    }
  }
}
