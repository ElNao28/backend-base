import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: HttpStatus;
}
