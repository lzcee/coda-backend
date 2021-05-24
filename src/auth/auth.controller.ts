import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './../auth/guards/local-auth.guard';
import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
