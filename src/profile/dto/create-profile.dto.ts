import { IsNotEmpty } from 'class-validator';
import { Profile } from '../entities/profile.entity';

export class CreateProfileDto implements Profile {
  @IsNotEmpty({ message: 'Укажите Ваше имя' })
  firstName: string;

  @IsNotEmpty({ message: 'Укажите Вашу Фамилию' })
  lastName: string;

  @IsNotEmpty({ message: 'Укажите адресс доставки' })
  address: string;

  userId: string;
}
