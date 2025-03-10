import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { convertObjectIdToString } from 'src/shared/entityUtils';

@Entity('notes')
export class Note extends BaseEntity {
  @ApiProperty({
    description: 'Title of the note',
    example: faker.lorem.text(),
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @Column({ nullable: false })
  @Index({ fulltext: true })
  title!: string;

  @ApiProperty({
    description: 'Content of the note',
    example: faker.lorem.paragraph(),
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  @Index({ fulltext: true })
  content!: string;

  @ApiProperty({
    description: 'ID of the owner of the note',
    example: '67cde5e03e647eb8cd00ba36',
  })
  @Column()
  @ObjectIdColumn()
  @Transform(
    ({ value }: { value: ObjectId }) => convertObjectIdToString(value),
    {
      toPlainOnly: true,
    },
  )
  ownerId: string;

  // @Transform(
  //   ({ value }: { value: ObjectId[] }) => value.map(convertObjectIdToString),
  //   {
  //     toPlainOnly: true,
  //   },
  // )
  // @ApiProperty({
  //   description: 'List of user IDs with whom the note is shared',
  //   example: ['67cde5e03e647eb8cd00ba36', '67cde5e03e647eb8cd00ba37'],
  // })
  // @IsString({ each: true })
  sharedWith: ObjectId[];
}
