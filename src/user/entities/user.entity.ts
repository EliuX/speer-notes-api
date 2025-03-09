import { faker } from '@faker-js/faker';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/shared/base.entity';
import { BCRYPT_SALT_ROUNDS } from 'src/shared/entityUtils';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  @ApiProperty({
    description: 'User"s name',
    minLength: 3,
    maxLength: 50,
    example: faker.person.fullName(),
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'User"s email address (must be unique)',
    format: 'email',
    example: faker.internet.email(),
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column({ nullable: false, select: false })
  @ApiProperty({
    description: 'User"s password (minimum 8 characters)',
    minLength: 8,
    writeOnly: true,
  })
  @IsString()
  @MinLength(8)
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'User"s phone number (optional)',
    example: faker.phone.number(),
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  async validatePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(
        this.password,
        Number(BCRYPT_SALT_ROUNDS),
      );
    }
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
