import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PreRegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
