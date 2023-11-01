/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  refresh_token: string;
}
