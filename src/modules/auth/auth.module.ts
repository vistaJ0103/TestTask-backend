import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
