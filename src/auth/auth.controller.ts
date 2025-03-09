import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Te user has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'The user could not be created because of invalid input',
  })
  async signUp(@Body() dto: CreateUserDto): Promise<AuthUserDto> {
    return await this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return this.authService.generateJWT(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    //This is equivalent to the whole code of signin
    return this.authService.generateJWT(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getActiveProfile(@Request() req) {
    return req.user || {};
  }
}
