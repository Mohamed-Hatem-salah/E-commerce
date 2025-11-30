import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { PaymentMethodEnum } from '../types/order.type';
import { IProduct } from '../types/product.type';
import { Product } from '../models/product.models';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createOrder({
    userId,
    discount = 0,
    instructions = [],
    address,
    phone,
    paymentMethod = PaymentMethodEnum.CASH,
  }: {
    userId: Types.ObjectId;
    discount?: number;
    instructions?: string[];
    address: string;
    phone: string;
    paymentMethod?: PaymentMethodEnum;
  }) {
    const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length == 0) {
      throw new ConflictException('cart is empty');
    }
    // const subtotal = cart.items.reduce((totalPrice, item) => totalPrice + ((item.product as unknown as IProduct).salePrice * item.quantity), 0);
    const subtotal = cart.items.reduce((totalPrice, item) => totalPrice + ((item.product as unknown as IProduct).salePrice * item.quantity as any), 0)
    const total = subtotal - ((discount == 0?0:discount/100) * subtotal)
    for (const item of cart.items) {
        await this.productModel.updateOne(item.product, {
            $inc: {
                stock: -item.quantity
            }
        });
    }

    const order = await this.orderModel.create({
        address,
        discount,
        instructions,
        items:cart.items,
        paymentMethod,
        phone,
        subtotal,
        total,
        user:userId
    })
    await cart.updateOne({
        items: []
    })
    return {
        data: {
            order
        }
    }
  }
}
