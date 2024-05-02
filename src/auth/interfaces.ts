import { Token } from '@prisma/client';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
  userLogin: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  phone: string;
  roles: string;
}
