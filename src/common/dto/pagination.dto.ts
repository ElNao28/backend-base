import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  offset: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @ApiProperty({ enum: SortOrder, required: false, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  orderBy: SortOrder;
}
