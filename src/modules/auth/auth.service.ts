import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await compare(password, user.password))) return null;
    return user;
  }

  async login(user: any) {
    const accessToken = { type: 'access', email: user.email, sub: user.id };
    const refreshToken = { type: 'refresh', email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(accessToken),
      refresh_token: this.jwtService.sign(refreshToken, {
        expiresIn: '1 year',
      }),
    };
  }
}
