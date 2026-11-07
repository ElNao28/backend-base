import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
export class UserDto {
  @ApiProperty()
  id: string;

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
  status: boolean;

  @ApiPropertyOptional({
    type: () => RolDto,
    nullable: true,
    isArray: true,
  })
  roles?: RolDto[];

  // @ApiPropertyOptional({
  //   type: () => RefreshTokenDto,
  //   nullable: true,
  //   isArray: true,
  // })
  // refreshTokens?: RefreshTokenDto[];

  // @ApiPropertyOptional({
  //   type: () => CredentialsDto,
  //   nullable: true,
  // })
  // credentials?: object;
}

export class RolDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty({
    type: () => UserDto,
    nullable: true,
    isArray: true,
  })
  users?: UserDto[];
}

export class RefreshTokenDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tokenHash: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  revoked: boolean;

  @ApiProperty()
  jti: string;

  @ApiProperty({
    type: () => UserDto,
    nullable: true,
  })
  user?: UserDto;
}

export class CredentialsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  passwordChangedAt?: Date | null;

  @ApiProperty({
    type: () => UserDto,
    nullable: true,
  })
  user?: object;
}
