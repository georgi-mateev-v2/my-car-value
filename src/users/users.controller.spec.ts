import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => { 
        return Promise.resolve({ id, email: 'email@email.com', password: 'password'} as User)  
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'password'} as User])
      },
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password} as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users with given email', async () => {
    const users = await controller.findAllUsers('email@email.com')

    expect(users.length).toBe(1)
    expect(users[0].email).toBe('email@email.com')
  })

  it('should return a user with a given id', async () => {
    const user = await controller.findUser('1')
    
    expect(user).toBeDefined();
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signinUser should sessionId and return user', async () => {
    const session = { userId: -10 }
    const user = await controller.signinUser({ email: 'email@email.com', password: 'password'}, session)

    expect(session.userId).toBe(1)
    expect(user.id).toBe(1)
  })
});
