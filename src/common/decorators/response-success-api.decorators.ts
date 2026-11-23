import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success-response.dto.js';

export const ResponseEmptyApi = (status: HttpStatus = HttpStatus.OK) =>
  applyDecorators(
    ApiResponse({
      status,
      type: SuccessResponseDto,
    }),
    HttpCode(status),
  );
