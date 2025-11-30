import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  IOrder,
  OrderStatusEnum,
  PaymentMethodEnum,
} from '../types/order.type';
import { User } from './user.model';
import { Product } from './product.models';

@Schema({
  timestamps: true,
})
export class Order implements IOrder {

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: Product.name,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  })
  items: { product: Types.ObjectId; quantity: number }[];

  @Prop({
    type:Number,
    required:true,
    default:0
  })
  subtotal: number;

  @Prop({
    type:Number,
    default:0
  })
  discount: number;

  @Prop({
    type:Number,
    required:true
  })
  total: number;

  @Prop({
    type:String,
    required:true
  })
  address: string;

  @Prop([{
    type:String
  }])
  instructions: string[];

  @Prop({
    type:String,
    required:true
  })
  phone: string;

  @Prop({
    type:String,
    enum:Object.values(PaymentMethodEnum),
    default:PaymentMethodEnum.CASH
  })
  paymentMethod: PaymentMethodEnum;

  @Prop({
    type:String,
    enum:Object.values(OrderStatusEnum),
    default:OrderStatusEnum.PENDING
  })
  orderStatus: OrderStatusEnum;
}


const orderSchema = SchemaFactory.createForClass(Order)

export const OrderModel= MongooseModule.forFeature([{
  name:Order.name,
  schema:orderSchema
}])