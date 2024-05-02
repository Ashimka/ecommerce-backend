import { Prisma } from '@prisma/client';

export class Category implements Prisma.CategoryUncheckedCreateInput {
  id?: number;
  name: string;
}
