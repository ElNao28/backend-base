import { ApiProperty } from '@nestjs/swagger';

export class PaginationDataDto {
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalPage: number;
}
