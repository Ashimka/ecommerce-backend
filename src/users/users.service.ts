import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { hashSync, genSaltSync } from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { JwtPayload } from '@auth/interfaces';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(user: Partial<User>) {
    const hashedPassword = user?.password ? this.hashPassword(user.password) : null;
    const newUser = await this.prismaService.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        phone: user?.phone,
        password: hashedPassword,
        provider: user?.provider,
        roles: user?.roles,
      },
      create: {
        email: user.email,
        phone: user.phone,
        password: hashedPassword,
        provider: user.provider,
      },
    });

    await this.cacheManager.set(newUser.email, newUser);

    return newUser;
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        profile: true,
        roles: true,
      },
    });
  }

  async findOne(idOrEailOrPhome: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(idOrEailOrPhome);
    }

    const user = await this.cacheManager.get<User>(idOrEailOrPhome);

    if (!user) {
      const foundUser = await this.prismaService.user.findFirst({
        where: {
          OR: [{ id: idOrEailOrPhome }, { email: idOrEailOrPhome }, { phone: idOrEailOrPhome }],
        },
      });

      if (!foundUser) return null;

      await this.cacheManager.set(
        idOrEailOrPhome,
        foundUser,
        convertToSecondsUtil(this.configService.get('JWT_EXP', process.env.JWT_EXP)),
      );

      return foundUser;
    }
    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Is not ADMIN');
    }

    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(user.email),
      this.cacheManager.del(user.phone),
    ]);

    return this.prismaService.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
