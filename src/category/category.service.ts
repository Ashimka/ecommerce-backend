import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: CreateCategoryDto) {
    const newCategory = await this.prismaService.category.create({
      data: {
        name: category.name,
      },
    });

    return newCategory;
  }

  async findAll() {
    return await this.prismaService.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const cat = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    return cat;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
