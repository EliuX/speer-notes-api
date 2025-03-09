import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, IsString, Length } from 'class-validator';

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
  title!: string;

  @ApiProperty({
    description: 'Content of the note',
    example: faker.lorem.paragraph(),
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  content!: string;

  @ApiProperty({
    description: 'ID of the owner of the note',
    example: '67cde5e03e647eb8cd00ba36',
  })
  @IsNotEmpty()
  @Column()
  ownerId: string;
}
