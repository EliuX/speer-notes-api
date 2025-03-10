import { OmitType } from '@nestjs/swagger';
import {
  CommonReadOnlyAttributes,
  convertStringToObjectId,
} from 'src/shared/entityUtils';
import { Note } from 'src/note/entities/note.entity';
import { plainToClassFromExist } from 'class-transformer';

export class CreateNoteDto extends OmitType(Note, [
  'ownerId',
  ...CommonReadOnlyAttributes,
]) {
  constructor(note: Partial<CreateNoteDto>) {
    super();
    Object.assign(this, note);
  }

  forUser(ownerId: string) {
    const note = new Note();
    return plainToClassFromExist(note, {
      ...this,
      ownerId: convertStringToObjectId(ownerId),
    });
  }
}
