import { Prisma } from '@prisma/client';

export class Product implements Prisma.ProductUncheckedCreateInput {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: number;
}
