import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/config/config.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const validationResult = this.ValidateEmail(email);
    if (!validationResult) {
      throw new BadRequestException('Email format is not correct');
    }
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new NotFoundException('User Not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { ...result } = user;

      return result;
    } else {
      throw new BadRequestException('Password not matched');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    const { accessToken, refreshToken } = await this.getTokens(payload);
    return {
      access_token: accessToken,
      status: 1,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRATION_TIME,
      user,
    };
  }

  async create(userDTO: CreateUserDto) {
    return this.usersService.createUser(userDTO);
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async ValidateEmail(email: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }
}
