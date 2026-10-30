import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondLastName?: string;

  @ApiProperty()
  @IsDateString()
  birthdate: string;

  @ApiProperty()
  @IsString()
  @Length(10)
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  password: string;
}
