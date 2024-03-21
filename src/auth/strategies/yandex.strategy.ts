import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('YANDEX_APP_ID', process.env.YANDEX_APP_ID),
      clientSecret: configService.get<string>('YANDEX_APP_SECRET', process.env.YANDEX_APP_SECRET),
      callbackURL: 'http://localhost:8010/api/v1/auth/yandex/callback', // Замените на свой callback URL
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    // Здесь вы можете провести проверку пользователя и сохранить его данные в базе данных, если это необходимо.
    const user = {
      id,
      displayName,
      email: emails[0].value,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
