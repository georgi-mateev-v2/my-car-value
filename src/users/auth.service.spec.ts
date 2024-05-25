import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'


describe('AuthService', () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>

	beforeEach(async () => {
		const users: User[] = [];

		fakeUsersService = {
			find: (email: string) => {
				const filteredUsers = users.filter(user => user.email === email)
				return Promise.resolve(filteredUsers)
			},
			create: (email: string, password: string) => {
				const createdUser = { id: Math.floor(Math.random() * 9999), email, password} as User;
				users.push(createdUser)

				return Promise.resolve(createdUser)
			}
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
    await service.signup('asdf@asdf.com', 'asdf');

    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

	it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj')
		).rejects.toThrow(NotFoundException);
  });

	it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

	it('returns a user on correct password', async () => {
		await service.signup('email@email.com', 'password')

		const user = await service.signin('email@email.com', 'password');
		expect(user).toBeDefined();
	})
})
