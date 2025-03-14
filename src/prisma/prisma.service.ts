import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      omit: {
        user: {
          password: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async withTransaction<T>(
    callback: (prisma: Omit<PrismaClient, ITXClientDenyList>) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      return callback(prisma);
    });
  }

  prismaWithPassword() {
    return new PrismaClient();
  }
}
