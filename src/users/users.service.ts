import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync } from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);
    return await this.prismaService.user.create({
      data: { ...createUserDto, password: hashedPassword, roles: 'USER' },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({});
  }

  async findOne(idOrEailOrPhome: string) {
    return this.prismaService.user.findFirst({
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
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
