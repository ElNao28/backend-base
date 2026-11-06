import { ApiProperty } from '@nestjs/swagger';
import { DefaultResponseDto } from '../../../common/dto/default-response.dto.js';
import { UserDto } from '../user.dto.js';

export class GetUsersResponse extends DefaultResponseDto {
  @ApiProperty({
    type: () => UserDto,
    isArray: true,
  })
  data: UserDto[];
}
