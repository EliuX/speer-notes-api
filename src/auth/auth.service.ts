import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(newUser: CreateUserDto): Promise<AuthUserDto> {
    const user = await this.userService.create(newUser);
    return new AuthUserDto(user);
  }

  async signIn(email: string, pass: string): Promise<AuthUserDto> {
    const user = await this.userService.findByEmailAndPassword(email, pass);
    if (user) {
      return new AuthUserDto(user);
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async generateJWT(user: AuthUserDto) {
    if (!user) {
      throw new UnauthorizedException('The user is not logged in');
    }

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUserDto | null> {
    const user = await this.userService.findByEmailAndPassword(email, password);
    if (user) {
      return new AuthUserDto(user);
    }

    return null;
  }
}
