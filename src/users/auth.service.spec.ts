import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'


describe('AuthService', () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>

	beforeEach(async () => {
	  // fake copy of the users service
		fakeUsersService = {
			find: () => Promise.resolve([]),
			create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
		}
	
		const module = await Test.createTestingModule({
				providers: [
					AuthService, 
					{
						provide: UsersService,
						useValue: fakeUsersService
					}	
			]
		}).compile();
	
		service = module.get(AuthService);
	});

	it('can create an instance of auth instance', async () => {
  	expect(service).toBeDefined();
	})

	it('create a new user with salted and hashed pass', async () => {
		const user = await service.signup('email@email.com', 'password');
		
		expect(user.password).not.toEqual('password');
		const [salt, hash] = user.password.split('.');
		
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	})


	it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'email@email.com', password: '1' } as User]);

    await expect(service.signup('email@email.com', 'password')).rejects.toThrow(BadRequestException);
  });

	it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj'))
			.rejects.toThrow(NotFoundException);
  });

	it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'email@email.com', password: 'laskdjf' } as User]);
    await expect(
      service.signin('email@email.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });
})
