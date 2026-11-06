import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PaginationDto {
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalPage: number;
}

export class DefaultResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: HttpStatus;
  @ApiPropertyOptional({
    type: () => PaginationDto,
    nullable: true,
  })
  pagination: PaginationDto;
}
