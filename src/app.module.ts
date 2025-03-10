import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/user/entities/user.entity';
import { Note } from 'src/note/entities/note.entity';
import { UserModule } from 'src/user/user.module';
import { NoteModule } from 'src/note/note.module';
import { AuthModule } from 'src/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    NoteModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        synchronize: !configService.isProduction(),
        entities: [User, Note],
        logging: true,
        type: 'mongodb',
        url: configService.getMongoURI(),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getThrottleLimit(),
          limit: config.getThrottleLimit(),
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
