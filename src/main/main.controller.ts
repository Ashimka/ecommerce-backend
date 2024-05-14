import { Public } from '@common/decorators';
import { Controller, Get } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Public()
@Controller('/')
export class MainController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  async allProducts() {
    return await this.productsService.findAll();
  }
}
