import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponseDto } from '../../../common/dto/default-response.dto.js';

export class SignInDataDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class SignInResponseDto extends DefaultResponseDto {
  @ApiProperty({
    type: SignInDataDto,
  })
  data: SignInDataDto;
}
