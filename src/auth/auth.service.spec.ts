import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { convertStringToObjectId } from 'src/shared/entityUtils';
import { AuthService } from 'src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository: jest.Mock<Repository<User>>;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a new user', async () => {
    const newUser = new CreateUserDto({
      email: 'test@example.com',
      name: 'tester',
      password: 'password',
    });
    const createdUser = {
      id: convertStringToObjectId('67cde5e03e647eb8cd00ba35'),
      email: 'test@example.com',
    };
    jest.spyOn(userService, 'create').mockResolvedValue(createdUser as any);

    const result = await service.signUp(newUser);
    expect(result).toEqual(new AuthUserDto(createdUser));
  });

  it('should sign in a user with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = {
      id: convertStringToObjectId('67cde5e03e647eb8cd00ba36'),
      email: 'test@example.com',
    };
    jest
      .spyOn(userService, 'findByEmailAndPassword')
      .mockResolvedValue(user as any);

    const result = await service.signIn(email, password);
    expect(result).toEqual(new AuthUserDto(user));
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    jest.spyOn(userService, 'findByEmailAndPassword').mockResolvedValue(null);

    await expect(service.signIn(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should generate JWT for a valid user', async () => {
    const user = new AuthUserDto({
      id: convertStringToObjectId('67cde5e03e647eb8cd00ba37'),
      email: 'test@example.com',
    });
    const token = 'jwt-token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await service.generateJWT(user);
    expect(result).toEqual({ access_token: token });
  });

  it('should throw UnauthorizedException if user is not logged in', async () => {
    await expect(service.generateJWT(null)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should validate a user with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = {
      id: convertStringToObjectId('67cde5e03e647eb8cd00ba26'),
      email: 'test@example.com',
    };
    jest
      .spyOn(userService, 'findByEmailAndPassword')
      .mockResolvedValue(user as any);

    const result = await service.validateUser(email, password);
    expect(result).toEqual(new AuthUserDto(user));
  });

  it('should return null for invalid credentials during validation', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    jest.spyOn(userService, 'findByEmailAndPassword').mockResolvedValue(null);

    const result = await service.validateUser(email, password);
    expect(result).toBeNull();
  });
});
