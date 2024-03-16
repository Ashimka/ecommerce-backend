import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync } from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return await this.prismaService.user.create({
      data: { email: user.email, phone: user.phone, password: hashedPassword, roles: 'USER' },
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

  async remove(id: string) {
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
