import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { RolesGuard } from '@auth/guards/role.guard';
import { Roles } from '@common/decorators';
import { Cart, Role } from '@prisma/client';
import { Request } from 'express';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('my/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createCart: Partial<Cart>, @Req() req: Request) {
    const id = req.user['id'];

    return await this.cartService.create({ ...createCart, userId: id });
  }

  @Get()
  async findAll(@Req() req: Request) {
    const userId: string = req.user['id'];
    return await this.cartService.findAll(userId);
  }

  @Get(':cartId')
  async findOne(@Param('cartId') cartId: number, @Body() bodyCart: Partial<Cart>, @Req() req: Request) {
    const userId: string = req.user['id'];
    const { productId } = bodyCart;
    return await this.cartService.findOne(userId, productId, +cartId);
  }

  @Patch()
  update(@Body() updateCart: UpdateCartDto, @Req() req: Request) {
    const userId: string = req.user['id'];
    const { id, productId, options } = updateCart;

    return this.cartService.update(userId, productId, id, options);
  }

  @Delete()
  remove(@Body() bodyCart: Partial<Cart>) {
    const { id } = bodyCart;
    return this.cartService.remove(id);
  }
}
