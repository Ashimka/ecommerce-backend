import { Prisma } from '@prisma/client';

export class Profile implements Prisma.ProfileUncheckedCreateInput {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  userId: string;
}
