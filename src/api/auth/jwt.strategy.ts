/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  refresh_token :string;
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['access_token'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
    });
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException('Your are not authrorized to access the apis.');
    }
    return payload as string;
  }
}
