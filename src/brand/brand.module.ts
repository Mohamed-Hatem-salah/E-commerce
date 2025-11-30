import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel } from '../models/brand.models';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../models/user.model';

@Module({

  imports: [BrandModel,UserModel],
  controllers: [BrandController],
  providers: [BrandService,JwtService]
})
export class BrandModule {}
