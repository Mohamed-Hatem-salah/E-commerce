import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from './user.model';
import slugify from 'slugify';
import { Brand } from './brand.models';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    set: function (value: string) {
      this.set({ slug: slugify(value) });
      return value;
    },
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  image: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Brand.name,
  })
  brands: Array<Types.ObjectId>;
}

const categorySchema = SchemaFactory.createForClass(Category);

categorySchema.pre('save', function (next) {
  next();
});

export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: categorySchema,
  },
]);
