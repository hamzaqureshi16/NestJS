import { User as PrismaUser } from '@prisma/client';

export class User implements PrismaUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
