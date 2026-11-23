import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegenerateRefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
