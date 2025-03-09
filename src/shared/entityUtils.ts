import { ObjectId } from 'mongodb';
import { BadRequestException } from '@nestjs/common';
import { BaseEntity } from './base.entity';

export const BCRYPT_SALT_ROUNDS = 10;

export const convertObjectIdToString = (id: ObjectId) => {
  return id.toString();
};

export const convertStringToObjectId = (uid: string) => {
  try {
    return ObjectId.createFromHexString(uid);
  } catch (e) {
    throw new BadRequestException(`The id "${uid}" has an invalid format`, {
      cause: e,
    });
  }
};

export const CommonReadOnlyAttributes: (keyof BaseEntity)[] = [
  'id',
  'createdAt',
  'updatedAt',
];
