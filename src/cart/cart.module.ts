import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModel } from '../models/user.model';
import { ProductdModel } from '../models/product.models';
import { CartModel } from '../models/cart.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    CartModel,
    UserModel,
    ProductdModel
  ],
  controllers: [CartController],
  providers: [CartService,JwtService]
})
export class CartModule {}
