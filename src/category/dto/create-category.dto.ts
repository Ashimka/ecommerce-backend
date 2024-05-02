import { IsNotEmpty } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto implements Category {
  @IsNotEmpty()
  name: string;
}
