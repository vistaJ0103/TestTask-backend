/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CredentialsDTO {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class SignupResponseDTO {
  @ApiProperty()
  status: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  id: string;
}

export class GeneralResponseDTO {
  @ApiProperty()
  status: number;
  @ApiProperty()
  message: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  msg: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  token_type: string;
  @ApiProperty()
  expires_in: number;
  @ApiProperty()
  user: any;
}

export class RefreshTokenDTO {
  @ApiProperty()
  status: number;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  accessToken: string;
}
