import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  data: boolean;
}
