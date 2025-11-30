import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { type IProduct } from '../types/product.type';
import { AuthGuard, type AuthRequest } from '../common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOption } from '../common/utils/multer';
import { CacheInterceptor } from '../common/interceptors/cash.interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multerOption('./src/uploads/products'),
    }),
  )
  async create(
    @Req() req: AuthRequest,
    @Body() data: IProduct,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    data.images = images.map((image) => image.path);
    data.createdBy = req.user._id;
    console.log(data);
    return this.productService.create(data);
  }


  @Get('test')
  @UseInterceptors(CacheInterceptor)
  async test() {
    return this.productService.getAll();
  }
   
}
