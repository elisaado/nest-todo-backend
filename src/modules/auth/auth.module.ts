import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import * as config from '../../../config.json';
import { JwtRefreshStrategy } from './jwtRefresh.strategy';
import * as passport from 'passport';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config.JWTSecret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes('/login');
    consumer
      .apply(passport.authenticate('jwt-refresh', { session: false }))
      .forRoutes('/refresh');
  }
}
