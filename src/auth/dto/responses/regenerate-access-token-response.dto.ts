import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponseDto } from '../../../common/dto/default-response.dto.js';

class AccessToken {
  @ApiProperty()
  accessToken: string;
}

export class RegenerateRefreshTokenResponseDto extends DefaultResponseDto {
  @ApiProperty()
  data: AccessToken;
}
