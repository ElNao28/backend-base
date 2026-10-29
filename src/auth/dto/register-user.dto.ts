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
  @IsString()
  name: string;
  @IsString()
  lastname: string;
  @IsString()
  @IsOptional()
  secondLastName?: string;
  @IsDateString()
  birthdate: string;
  @IsString()
  @Length(10)
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  password: string;
}
