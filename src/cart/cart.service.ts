import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.models';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async getCart(userId: Types.ObjectId) {
    let cart = await this.cartModel
      .findOne({
        user: userId,
      })
      .populate([
        {
          path: 'items.product',
        },
      ]);

    if (!cart) {
      cart = await this.cartModel.create({
        items: [],
        user: userId,
      });
    }
    return {
      data: cart,
    };
  }

  async addToCart({
    userId,
    product,
    quantity,
  }: {
    product: Types.ObjectId;
    quantity: number;
    userId: Types.ObjectId;
  }) {
    const isProductExist = await this.productModel.findOne({
      _id: product,
      stock: {
        $gte: quantity,
      },
    });
    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await this.cartModel.create({
        user: userId,
        items: [
          {
            product,
            quantity,
          },
        ],
      });
      return { data: cart };
    }
    const index = cart.items.findIndex((item) => {
      return item.product.toString() == product.toString();
    });

    if (index == -1) {
      cart.items.push({
        product,
        quantity,
      });
      await cart.save();
      return { data: cart };
    }
    const totalQuantity = cart.items[index].quantity + quantity;
    if (!((isProductExist?.stock as number) >= totalQuantity)) {
      cart.items[index].quantity = isProductExist?.stock as number;
      await cart.save();

      throw new NotFoundException(
        `available quantity is ${isProductExist?.stock}`,
      );
    }
    cart.items[index].quantity = totalQuantity;
    await cart.save();
    return { data: cart };
  }

  async removeFromCart({
    product,
    userId,
  }: {
    product: Types.ObjectId;
    userId: Types.ObjectId;
  }) {
    const cart = await this.cartModel.findOne({
      user: userId,
    });

    if (!cart || cart.items.length == 0) {
      throw new ConflictException('cart is empty');
    }

    const index = cart.items.findIndex((item) => {
      return item.product.toString() == product.toString();
    });

    if (index == -1) {
      throw new NotFoundException('product not found in cart');
    }

    cart.items.splice(index, 1);
    await cart.save();
    return {
      data: cart,
    };
  }
}
