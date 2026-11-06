import { ApiProperty } from '@nestjs/swagger';

export class SignInDataResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
