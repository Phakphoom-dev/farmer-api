import type { User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser: User = {
    id: 3,
    username: 'test',
    password: 'test',
    firstname: 'test',
    lastname: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    roleId: 3,
  };

  const mockUserDto: UserDto = {
    username: 'test',
    password: 'test',
    firstname: 'farmer',
    lastname: 'farmer',
  };

  const mockUserService = {
    addUser: jest.fn().mockResolvedValueOnce(mockUserDto),
    findUniqueUserById: jest.fn().mockResolvedValueOnce(mockUser),
    updateUser: jest.fn().mockResolvedValueOnce(mockUser),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('when the registerFarmer function is called', () => {
    describe('and the registerFarmer method created success', () => {
      const createdResponse = {
        message: 'register farmer success',
      };

      it('should created success', async () => {
        const result = await userController.registerFarmer(mockUserDto);

        expect(userService.addUser).toHaveBeenCalled();
        expect(result).toEqual(createdResponse);
      });
    });
  });

  describe('when the updateProfile function is called', () => {
    describe('when updated success', () => {
      it('should created success', async () => {
        const updatedResponse = {
          message: 'update profile success',
        };

        const result = await userController.updateProfile(
          mockUser,
          3,
          mockUserDto,
        );

        expect(userService.findUniqueUserById).toHaveBeenCalled();
        expect(userService.updateUser).toHaveBeenCalled();
        expect(result).toEqual(updatedResponse);
      });
    });

    describe('should update user id not match', () => {
      it('should throw forbidden exception', async () => {
        mockUserService.findUniqueUserById = jest
          .fn()
          .mockResolvedValueOnce(mockUser);

        expect(
          await userController.updateProfile(
            { ...mockUser, id: 4 },
            3,
            mockUserDto,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(userService.findUniqueUserById).toHaveBeenCalled();
        expect(userService.updateUser).not.toHaveBeenCalled();
      });
    });
  });
});
