import { IsPasswordsMatchingConstraint } from '@common/decorators/is-password-matching';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Введите ваш действующий email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Номер телефона 10 символов' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
  password: string;

  // @IsNotEmpty()
  @IsString()
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat?: string;
}
