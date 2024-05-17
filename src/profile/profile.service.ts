import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProfileDto: CreateProfileDto) {
    return await this.prismaService.profile.create({
      data: {
        firstName: createProfileDto.firstName,
        lastName: createProfileDto.lastName,
        address: createProfileDto.address,
        userId: createProfileDto.userId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.profile.findFirst({
      where: {
        userId: id,
      },
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);

    if (!profile) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.profile.update({
      where: {
        userId: id,
      },
      data: updateProfileDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
