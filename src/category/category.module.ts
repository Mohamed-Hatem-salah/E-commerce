import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryModel } from '../models/category.models';
import { BrandModel } from '../models/brand.models';
import { UserModel } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[CategoryModel,BrandModel,UserModel],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService]
})
export class CategoryModule {}
