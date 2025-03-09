import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class AuthUserDto extends PickType(User, ['id', 'email']) {
  access_token?: string;

  constructor(user: Partial<AuthUserDto>) {
    super();
    const { id, email, access_token } = user;
    Object.assign(this, { id, email, access_token });
  }

  isAuthenticated(): boolean {
    return !!this.access_token;
  }
}
