import { Cookie } from '@common/decorators/cookies.decorator';
import { UserAgent } from '@common/decorators/user-agent.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './interfaces';
import { UserResponse } from '@user/responses';

const REFRESH_TOKEN = 'rf_token';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);

    if (!user) {
      throw new BadRequestException(`Не удалось зарегистрировать с данными ${JSON.stringify(dto)}`);
    }

    return new UserResponse(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException(`Авторизация не удалась!`);
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('refresh')
  async refresh(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
    if (!refreshToken || typeof refreshToken === 'object') {
      throw new UnauthorizedException('Не авторизован');
    }

    const tokens = await this.authService.refresh(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException(`Не авторизован`);
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException('Не авторизован');
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure: this.configService.get('NODE_ENV', process.env.NODE_ENV) === 'production',
      path: '/',
    });

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
