import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('notes')
export class Note {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  ownerId: string;

  @Column({ insert: true })
  createdAt = new Date();

  @Column({ update: true })
  updatedAt = new Date();
}
