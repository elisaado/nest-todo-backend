import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as config from '../../../config.json';
import * as passport from 'passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWTSecret,
    });
    passport.use('jwt', this);
  }

  async validate(payload: any) {
    if (payload.type !== 'access')
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Not an access token',
        },
        HttpStatus.UNAUTHORIZED,
      );

    return this.userService.findById(payload.sub);
  }
}
