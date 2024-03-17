import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { hashSync, genSaltSync } from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { JwtPayload } from '@auth/interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);

    return await this.prismaService.user.create({
      data: { email: user.email, phone: user.phone, password: hashedPassword },
    });
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

  async findOne(idOrEailOrPhome: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEailOrPhome }, { email: idOrEailOrPhome }, { phone: idOrEailOrPhome }],
      },
    });
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
