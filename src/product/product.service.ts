import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from '../models/brand.models';
import { Category } from '../models/category.models';
import { Product } from '../models/product.models';
import { type IProduct } from '../types/product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(data: IProduct) {
    const brand = await this.brandModel.findOne({ _id: data.brand });
    if (!brand) {
      throw new Error('brand not found');
    }
    const category = await this.categoryModel.findOne({ _id: data.category });

    if (!category) {
      throw new Error('category not found');
    }
    data.salePrice =
      data.originalPrice - (data.discount / 100) * data.originalPrice;
    const product = await this.productModel.create(data);
    return {
      data: product,
    };
  }


  async getAll() {
    const data = await this.productModel.findOne()
    return{
      data
    }
  }
}
