import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICategory } from '../types/category.type';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../models/category.models';
import { Model, Types } from 'mongoose';
import { Brand } from '../models/brand.models';
import fs from 'fs/promises';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(data: ICategory) {
    const isExist = await this.categoryModel.findOne({ name: data.name });
    if (isExist) {
      throw new ConflictException('category already exist');
    }
    if (data.brands && data.brands.length) {
      const foundBrands = await this.brandModel.find({
        _id: { $in: data.brands },
      });
      if (foundBrands.length != data.brands.length) {
        throw new NotFoundException('some brand not found');
      }
    }
    const category = await this.categoryModel.create(data);
    return category;
  }

  async update(categoryId: Types.ObjectId, data: ICategory) {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      createdBy: data.createdBy,
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    if (data.brands && data.brands.length) {
      const foundBrands = await this.brandModel.find({
        _id: { $in: data.brands },
      });
      if (foundBrands.length != data.brands.length) {
        throw new NotFoundException('some brand not found');
      }
    }
    if (data.brands?.length) {
      category.brands = data.brands;
    }
    if (data.name) {
      category.name = data.name;
    }
    if (data.image) {
      if (category.image) {
        await fs.unlink(category.image);
      }
      category.image = data.image;
    }

    await category.save();
    return category;
  }

  async findAll() {
    return await this.categoryModel.find().populate([
      {
        path: 'brands',
      },
    ]);
  }
}
