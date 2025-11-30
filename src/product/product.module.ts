import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModel } from '../models/user.model';
import { CategoryModel } from '../models/category.models';
import { BrandModel } from '../models/brand.models';
import { ProductdModel } from '../models/product.models';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModel,
    CategoryModel,
    BrandModel,
    ProductdModel
  ],
  controllers: [ProductController],
  providers: [ProductService,JwtService],
})
export class ProductModule {}
