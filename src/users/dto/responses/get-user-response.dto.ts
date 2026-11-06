import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponseDto } from '../../../common/dto/default-response.dto.js';
import { UserDto } from '../user.dto.js';

export class GetUserResponseDto extends DefaultResponseDto {
  @ApiProperty({
    type: () => UserDto,
  })
  data: UserDto;
}
