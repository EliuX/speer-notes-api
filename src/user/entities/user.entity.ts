import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber?: string;

  @Column({ insert: true })
  createdAt = new Date();

  @Column({ update: true })
  updatedAt = new Date();
}
