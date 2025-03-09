import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Te user has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'There was an error in the request.' })
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
