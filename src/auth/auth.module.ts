import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from 'src/config/config.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  exports: [UserModule],
})
export class AuthModule {}
