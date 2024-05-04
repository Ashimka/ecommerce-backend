import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const duplicateProduct = await this.findOne(createProductDto.name);

    if (!duplicateProduct) {
      return await this.prismaService.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
        },
      });
    }
    throw new HttpException('Продукт уже существует', HttpStatus.CONFLICT);
  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findOne(idOrName: string) {
    return await this.prismaService.product.findFirst({
      where: {
        OR: [{ id: idOrName }, { name: idOrName }],
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (!product) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }

    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.product.delete({
      where: {
        id,
      },
    });
    return { message: 'Удалено' };
  }
}
