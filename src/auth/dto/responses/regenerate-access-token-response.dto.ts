import { ApiProperty } from '@nestjs/swagger';

export class RegenerateRefreshTokenResponseDto {
  @ApiProperty()
  accessToken: string;
}
