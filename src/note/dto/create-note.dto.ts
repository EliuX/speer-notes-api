import { OmitType } from '@nestjs/swagger';
import { CommonReadOnlyAttributes } from 'src/shared/entityUtils';
import { Note } from '../entities/note.entity';

export class CreateNoteDto extends OmitType(Note, [
  'ownerId',
  ...CommonReadOnlyAttributes,
]) {}
