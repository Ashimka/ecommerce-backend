import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(cart: Partial<Cart>) {
    return await this.prismaService.cart.create({
      data: {
        userId: cart.userId,
        productId: cart.productId,
        count: cart.count,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.cart.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, idProduct: string, cartId: number) {
    const productInCart = await this.prismaService.cart.findFirst({
      where: {
        AND: [{ id: +cartId }, { userId: id }, { productId: idProduct }],
      },
    });

    if (!productInCart) {
      throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
    }

    return productInCart;
  }

  async update(userId: string, productId: string, id: number, options: string) {
    const foundProductInCart = await this.findOne(userId, productId, +id);

    if (options === 'minus' && foundProductInCart.count === 1) {
      return await this.remove(+id);
    }

    if (options === 'minus') {
      return await this.prismaService.cart.update({
        where: {
          id,
        },
        data: {
          count: +foundProductInCart.count - 1,
        },
      });
    }

    if (options === 'plus') {
      return await this.prismaService.cart.update({
        where: {
          id,
        },
        data: {
          count: +foundProductInCart.count + 1,
        },
      });
    }
  }

  async remove(id: number) {
    await this.prismaService.cart.delete({
      where: { id },
    });
    return `Продукт удален из корзины`;
  }
}
