import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard, type AuthRequest } from '../common/guards/auth.guard';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getCart(@Req() req: AuthRequest) {
    const userId = req.user._id;
    const data = await this.cartService.getCart(userId);
    return data;
  }

  @Post('add-to-cart')
  @UseGuards(AuthGuard)
  async addToCart(@Req() req: AuthRequest) {
    const userId = req.user._id;
    const { quantity, product } = req.body;
    return await this.cartService.addToCart({
      userId,
      product,
      quantity,
    });
  }

  @Patch('remove-from-cart')
  @UseGuards(AuthGuard)
  async removeFromCart(@Req() req: AuthRequest) {
    const userId = req.user._id;
    const { product } = req.body;
    return await this.cartService.removeFromCart({
      userId,
      product,
    });
  }
}
