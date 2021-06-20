import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as config from '../../../config.json';
import * as passport from 'passport';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWTSecret,
    });

    passport.use('jwt-refresh', this);
  }

  async validate(payload: any) {
    if (payload.type !== 'refresh')
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Not a refresh token',
        },
        HttpStatus.UNAUTHORIZED,
      );

    return this.userService.findById(payload.sub);
  }
}
