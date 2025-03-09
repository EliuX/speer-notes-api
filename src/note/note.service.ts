import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { UpdateNoteDto } from 'src/note/dto/update-note.dto';
import { Note } from './entities/note.entity';
import { MongoRepository } from 'typeorm';
import { convertStringToObjectId } from 'src/shared/entityUtils';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: MongoRepository<Note>,
  ) {}

  async create(newNote: CreateNoteDto, ownerId: string): Promise<Note> {
    const noteDto = new CreateNoteDto(newNote);
    console.log('note', noteDto);
    return this.noteRepository.save(noteDto.forUser(ownerId));
  }

  findAll(ownerId?: string) {
    return this.noteRepository.find({
      ownerId: ownerId ? convertStringToObjectId(ownerId) : undefined,
    });
  }

  async findOne(uid: string, ownerId: string): Promise<Note> {
    const user = await this.noteRepository.findOneBy({
      id: convertStringToObjectId(uid),
      ownerId: ownerId ? convertStringToObjectId(ownerId) : undefined,
    });

    if (!user) {
      throw new NotFoundException(`The note with ID "${uid}" was not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateData: UpdateNoteDto,
    ownerId: string,
  ): Promise<Note> {
    const existingNote = await this.findOne(id, ownerId);
    Object.assign(existingNote, updateData);
    return this.noteRepository.save(existingNote);
  }

  async delete(uid: string, ownerId?: string): Promise<void> {
    const existingNote = await this.findOne(uid, ownerId);

    const result = await this.noteRepository.delete(existingNote);

    if (!result.affected) {
      throw new NotFoundException(`No note with ID "${uid}" was found`);
    }
  }
}
