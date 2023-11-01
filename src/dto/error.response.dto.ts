/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ErrorResponseDTO {
  @IsNotEmpty()
  @ApiProperty()
  statusCode: number;

  @IsNotEmpty()
  @ApiProperty()
  error: string;

  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: number;
}
