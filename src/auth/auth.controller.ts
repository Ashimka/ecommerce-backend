import { Cookie, Public, UserAgent } from '@common/decorators';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './interfaces';
import { UserResponse } from '@user/responses';
import { YandexGuard } from './guards/yandex.guard';
import { map, mergeMap } from 'rxjs';
import { Provider } from '@prisma/client';
import { handleTimeoutAndErrors } from '@common/helpers';

const REFRESH_TOKEN = 'RF_T';
const ACCESS_TOKEN = 'AC_T';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);

    if (!user) {
      throw new BadRequestException(`Не удалось зарегистрировать`);
    }

    return new UserResponse(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new UnauthorizedException(`Неверный логин или пароль!`);
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

    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 1000,
      secure: this.configService.get('NODE_ENV', process.env.NODE_ENV) === 'production',
      path: '/',
    });

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken, userLogin: tokens.userLogin });
  }

  @Post('logout')
  async logout(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      return res.sendStatus(HttpStatus.OK);
    }

    await this.authService.deleteRefreshToken(refreshToken);

    res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
    res.cookie(ACCESS_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
    res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(YandexGuard)
  @Get('yandex')
  yandexAuth() {}

  @UseGuards(YandexGuard)
  @Get('yandex/callback')
  yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(`http://localhost:8010/api/v1/auth/success-yandex?token=${token}`);
  }

  @Get('success-yandex')
  successYandex(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
    return this.httpService.get(`https://login.yandex.ru/info?format=json&oauth_token=${token}`).pipe(
      mergeMap(({ data: { default_email, default_phone } }) =>
        this.authService.providerAuth(default_email, default_phone, agent, Provider.YANDEX),
      ),
      map((data) => this.setRefreshTokenToCookies(data, res)),
      handleTimeoutAndErrors(),
    );
  }
}
