import { BulkWriteResult, MongoBulkWriteError, WriteError } from 'mongodb';

import { DuplicateExceptionFilter } from './duplicate-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { respondWithStandardFormat } from './errorUtils';

jest.mock('src/error/errorUtils');

describe('DuplicateExceptionFilter', () => {
  let filter: DuplicateExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;

  const mockRespondWithStandardFormat =
    respondWithStandardFormat as jest.MockedFunction<
      typeof respondWithStandardFormat
    >;

  beforeEach(() => {
    filter = new DuplicateExceptionFilter();
    mockArgumentsHost = createMock<ArgumentsHost>();
    mockRespondWithStandardFormat.mockReset();
  });

  it('should catch MongoBulkWriteError and format error', () => {
    const mockMongoError: MongoBulkWriteError = new MongoBulkWriteError(
      {
        message:
          'E11000 duplicate key error collection: perfima.users index: email_1 dup key: { email: "test@test.com" }',
        code: 11000,
        writeErrors: [
          {
            err: {
              errmsg:
                'E11000 duplicate key error collection: perfima.users index: email_1 dup key: { email: "test@test.com" }',
            },
          } as WriteError,
        ],
      },
      {
        insertedCount: 0,
        matchedCount: 0,
        modifiedCount: 0,
        deletedCount: 0,
        upsertedCount: 0,
        upsertedIds: {},
        insertedIds: {},
      } as BulkWriteResult,
    );

    filter.catch(mockMongoError, mockArgumentsHost);

    expect(mockRespondWithStandardFormat).toBeCalledWith(
      mockArgumentsHost,
      400,
      { email: 'test@test.com' },
    );
  });

  it('should return default message when no writeErrors', () => {
    const mockMongoError: any = {};

    filter.catch(mockMongoError, mockArgumentsHost);

    expect(mockRespondWithStandardFormat).toBeCalledWith(
      mockArgumentsHost,
      400,
      {},
    );
  });
});
