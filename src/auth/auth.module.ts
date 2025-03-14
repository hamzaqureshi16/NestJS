import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtConstants } from './constants';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'your_secret_key',
      signOptions: JwtConstants,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
