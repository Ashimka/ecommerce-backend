import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@user/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { Token, User } from '@prisma/client';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const foundUserEmail = await this.userService.findOne(dto.email);

      if (foundUserEmail) {
        throw new ConflictException('Пользователь с таким email уже зарегистрирован');
      }
      const foundUserPhone = await this.userService.findOne(dto.phone);

      if (foundUserPhone) {
        throw new ConflictException('Пользователь с таким номером телефона уже зарегистрирован');
      }

      return await this.userService.create(dto);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    try {
      const foundUser = await this.userService.findOne(dto.phone, true);

      if (!foundUser || compareSync(dto.password, foundUser.email)) {
        throw new UnauthorizedException('Неверный логин или пароль!');
      }

      return this.generateTokens(foundUser, agent);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: {
        userId,
        userAgent: agent,
      },
    });

    const token = _token?.token ?? '';

    return this.prismaService.token.upsert({
      where: {
        token,
      },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }

  private async generateTokens(user: User, agent: string) {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id, agent);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.delete({
      where: {
        token: refreshToken,
      },
    });

    if (!token || new Date(token.exp) < new Date()) {
      throw new UnauthorizedException('Не авторизован');
    }
    const user = await this.userService.findOne(token.userId);

    return this.generateTokens(user, agent);
  }

  async deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({
      where: {
        token,
      },
    });
  }
}
