import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto implements User {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Введите ваш действующий email' })
  email: string;

  @IsNotEmpty()
  @MinLength(10, { message: 'Номер телефона 10 символов' })
  phone: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
  password: string;
}
