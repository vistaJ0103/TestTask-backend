import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponseDTO } from 'src/dto/error.response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  CredentialsDTO,
  GeneralResponseDTO,
  LoginResponseDTO,
  SignupResponseDTO,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'User register endpoint.',
    description: 'User signup with email, password.',
  })
  @ApiResponse({
    status: 200,
    type: SignupResponseDTO,
    description: 'Signup success',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDTO,
    description: 'Validation error',
  })
  async register(@Body() user: CreateUserDto) {
    return this.authService.create(user);
  }

  @ApiBody({ type: CredentialsDTO })
  @Post('/login')
  @ApiOperation({
    summary: 'User login endpoint.',
    description: 'User login with email, password.',
  })
  @ApiResponse({
    status: 201,
    type: LoginResponseDTO,
    description: 'User logged and JWT returned.',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDTO,
    description: 'Validation error',
  })
  async login(@Body() body: CredentialsDTO) {
    return this.authService.login(
      await this.authService.validateUser(body.email, body.password),
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout endpoint.',
    description: 'User logout api. Access token is required.',
  })
  @ApiResponse({
    status: 201,
    type: GeneralResponseDTO,
    description: 'New access_token, refresh_token are returned.',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDTO,
    description: 'Validation error',
  })
  async logout(@Req() req: any) {
    Logger.log(req.user.id);
    return { msg: 'Signed out successfully', status: 1 };
  }
}
