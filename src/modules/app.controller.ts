import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @UseGuards(AuthGuard('local'))
  // @Post('/')
  // async login(@Request() req) {
  //   return req.user;
  // }

  @Get('/')
  async hello() {
    return this.appService.getHello();
  }
}
