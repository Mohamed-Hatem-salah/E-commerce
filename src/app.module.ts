import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: 'config/.env.dev'
  }), AuthModule,
  MongooseModule.forRoot(process.env.MONGO_URI! , {
    onConnectionCreate: (connection) => {
      connection.on('connected', () => console.log('DBconnected'));
      connection.on('open', () => console.log('DB open'));
      connection.on('disconnected', () => console.log('DB disconnected'));
      connection.on('reconnected', () => console.log('DB reconnected'));
  }
  }),
  BrandModule,
  CategoryModule,
  ProductModule,
  CartModule,
  OrderModule

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '/auth/login',
      method: RequestMethod.POST
  })
  }
}
