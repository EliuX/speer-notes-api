import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, AuthModule, TypeOrmModule.forFeature([Note])],
  controllers: [NoteController],
  providers: [NoteService, JwtService],
  exports: [NoteService],
})
export class NoteModule {}
