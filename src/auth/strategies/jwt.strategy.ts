import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@auth/interfaces';
import { UsersService } from '@user/users.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', process.env.JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user: User = await this.userService.findOne(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }
      return null;
    } catch (error) {
      this.logger.error(error);
    }
    return payload;
  }
}
