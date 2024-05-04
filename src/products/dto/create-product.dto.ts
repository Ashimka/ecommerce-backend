import { IsNotEmpty } from 'class-validator';
import { Product } from '../entities/product.entity';

export class CreateProductDto implements Product {
  @IsNotEmpty({ message: 'Заполните поле НАЗВАНИЕ' })
  name: string;

  @IsNotEmpty({ message: 'Заполните поле ОПИСАНИЕ' })
  description: string;

  @IsNotEmpty({ message: 'Заполните поле ЦЕНА' })
  price: number;
}
