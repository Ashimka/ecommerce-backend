import { Prisma, Role } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  role?: Role;
  email: string;
  phone: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
