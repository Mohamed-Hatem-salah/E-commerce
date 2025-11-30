import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModel } from '../models/user.model';
import { ProductdModel } from '../models/product.models';
import { CartModel } from '../models/cart.model';
import { JwtService } from '@nestjs/jwt';
import { OrderModel } from '../models/order.model';

@Module({
  imports:[
    UserModel,
    OrderModel,
    CartModel,
    ProductdModel
  ],
  controllers: [OrderController],
  providers: [OrderService,JwtService]
})
export class OrderModule {}
