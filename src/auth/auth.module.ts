import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config/jwt-module-async-options';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, PassportModule, JwtModule.registerAsync(options())],
})
export class AuthModule {}
