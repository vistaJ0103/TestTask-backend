import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET_KEY ||
        'f6b5b076-02b8-43c9-b6d3-628321ca68b5dddddd',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
