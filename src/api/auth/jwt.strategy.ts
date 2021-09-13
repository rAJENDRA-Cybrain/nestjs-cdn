/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException('Your are not authrorized to access the apis.');
    }
    return payload;
  }
}



// [
//   (request: Request) => {
//     const data = request?.cookies['access_token'];
//     if (!data) {
//       return null;
//     }
//     return data;
//   },
// ]