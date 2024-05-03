import { IsNotEmpty } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto implements Category {
  id?: number;
  @IsNotEmpty()
  name: string;
}
