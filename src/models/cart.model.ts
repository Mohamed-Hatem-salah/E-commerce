import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./user.model";
import { ICart } from "../types/cart.type";
import { Product } from "./product.models";


@Schema({
    timestamps: true
})
export class Cart implements ICart {
    @Prop({
        type: Types.ObjectId,
        required: true,
        unique: true,
        ref: User.name
    })
    user: Types.ObjectId;

    @Prop({
        type: [{
            product: {
                type: Types.ObjectId,
                ref: Product.name,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: []
    })
    items: { product: Types.ObjectId; quantity: number; }[];
}

const cartSchema = SchemaFactory.createForClass(Cart)

export const CartModel = MongooseModule.forFeature([
    {
        name: Cart.name,
        schema: cartSchema
    }
])