import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Column, ObjectIdColumn } from 'typeorm';
import { convertObjectIdToString } from './entityUtils';

export abstract class BaseEntity {
  @ObjectIdColumn()
  @Transform(
    ({ value }: { value: ObjectId }) => convertObjectIdToString(value),
    {
      toPlainOnly: true,
    },
  )
  id!: ObjectId;

  @Column({ insert: true })
  createdAt = new Date();

  @Column({ update: true })
  updatedAt = new Date();
}
