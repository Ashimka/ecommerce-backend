import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Номер телефона 10 символов' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
  password: string;
}
