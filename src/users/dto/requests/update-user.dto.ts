import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '../responses/user.dto.js';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['id', 'roles', 'status']),
) {}
