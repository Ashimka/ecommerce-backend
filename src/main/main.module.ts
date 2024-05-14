import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { ProductsService } from 'src/products/products.service';

@Module({
  controllers: [MainController],
  providers: [ProductsService],
})
export class MainModule {}
