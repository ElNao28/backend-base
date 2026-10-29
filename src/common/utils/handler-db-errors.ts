import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

interface PostgresError extends QueryFailedError {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

export const handleDatabaseErrors = (error: unknown): never => {
  console.error('DATABASE ERROR:', error);

  if (error instanceof QueryFailedError) {
    const pgError = error as PostgresError;

    switch (pgError.code) {
      /**
       * 23505 — unique_violation
       */
      case '23505':
        throw new ConflictException('Resource already exists.');

      /**
       * 23503 — foreign_key_violation
       */
      case '23503':
        throw new BadRequestException('Invalid reference to related resource.');

      /**
       * 23502 — not_null_violation
       */
      case '23502':
        throw new BadRequestException(
          `Missing required field: ${pgError.column ?? 'unknown field'}`,
        );

      /**
       * 22P02 — invalid_text_representation
       * Example: invalid UUID
       */
      case '22P02':
        throw new BadRequestException('Invalid input format.');

      /**
       * 22001 — string_data_right_truncation
       */
      case '22001':
        throw new BadRequestException('Input value is too long.');

      /**
       * 40001 — serialization_failure
       */
      case '40001':
        throw new ConflictException('Transaction conflict. Please retry.');

      /**
       * 42P01 — undefined_table
       */
      case '42P01':
        throw new InternalServerErrorException('Database configuration error.');

      /**
       * 42703 — undefined_column
       */
      case '42703':
        throw new InternalServerErrorException('Database configuration error.');

      default:
        throw new InternalServerErrorException('Unexpected database error.');
    }
  }

  // Fallback for non-DB errors
  throw new InternalServerErrorException('An unexpected error occurred.');
};
