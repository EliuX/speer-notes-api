import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  ownerId: string;
}
