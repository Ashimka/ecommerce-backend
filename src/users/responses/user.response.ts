import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;

  email: string;

  phone: string;

  @Exclude()
  password: string;

  roles: Role;

  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
