import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: CreateCategoryDto) {
    const cat = await this.findOne(category.name);
    if (cat) {
      throw new HttpException('Категория уже существует', HttpStatus.CONFLICT);
    }
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

  async findOne(idOrName: string) {
    let cat: CreateCategoryDto | undefined;
    if (typeof idOrName === 'number') {
      cat = await this.prismaService.category.findUnique({
        where: {
          id: +idOrName,
        },
      });
    }
    if (typeof idOrName === 'string') {
      cat = await this.prismaService.category.findUnique({
        where: {
          name: idOrName,
        },
      });
    }

    if (!cat) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }
    return cat;
  }

  async update(cat: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prismaService.category.update({
      where: {
        name: cat,
      },
      data: { name: updateCategoryDto.name },
    });
  }

  async remove(id: string) {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.category.delete({
      where: {
        id: +id,
      },
    });
  }
}
