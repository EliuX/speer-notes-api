import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return this.noteRepository.save(noteDto.forUser(ownerId));
  }

  async findAll(ownerId?: string) {
    return this.noteRepository.find({
      where: {
        ownerId: convertStringToObjectId(ownerId),
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findOne(uid: string, ownerId: string): Promise<Note> {
    const user = await this.noteRepository.findOne({
      where: {
        _id: convertStringToObjectId(uid),
        ownerId: convertStringToObjectId(ownerId),
      },
    });

    if (!user) {
      throw new NotFoundException(`The note with ID "${uid}" was not found`);
    }

    return user;
  }

  async update(
    uid: string,
    updateData: UpdateNoteDto,
    ownerId: string,
  ): Promise<Note> {
    const mergeData = Object.assign(new UpdateNoteDto(updateData), {
      ownerId: convertStringToObjectId(ownerId),
    });

    await this.noteRepository.findOneAndUpdate(
      {
        _id: convertStringToObjectId(uid),
        ownerId: convertStringToObjectId(ownerId),
      },
      { $set: mergeData },
    );

    return this.findOne(uid, ownerId);
  }

  async delete(uid: string, ownerId?: string): Promise<void> {
    const result = await this.noteRepository.deleteOne({
      _id: convertStringToObjectId(uid),
      ownerId: convertStringToObjectId(ownerId),
    });

    if (!result.deletedCount) {
      throw new NotFoundException(`No user with ID "${uid}" was found`);
    }
  }

  async share(noteId: string, anotherUserId: string, ownerId: string) {
    console.warn(noteId, anotherUserId, ownerId);

    const note = await this.findOne(noteId, ownerId);
    const targetUserId = convertStringToObjectId(anotherUserId);

    note.sharedWith = note.sharedWith || [];
    if (note.sharedWith.includes(targetUserId)) {
      throw new ConflictException(
        `The note is already shared the specified user`,
      );
    }

    note.sharedWith.push(targetUserId);
    return this.update(
      noteId,
      {
        sharedWith: note.sharedWith,
      },
      ownerId,
    );
  }
}
