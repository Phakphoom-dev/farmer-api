import { PrismaService } from '../../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import type { SaleTransaction, User } from '@prisma/client';
import { SaleTransactionService } from '../sale-transaction.service';

describe('SaleTransactionService', () => {
  let saleTransactionService: SaleTransactionService;
  let findManyMock: jest.Mock;
  let createMock: jest.Mock;
  const mockUser: User = {
    id: 3,
    username: 'username',
    password: 'password',
    firstname: 'firstname',
    lastname: 'lastname',
    createdAt: new Date(),
    updatedAt: new Date(),
    roleId: 1,
  };

  beforeEach(async () => {
    findManyMock = jest.fn();
    createMock = jest.fn();
    const moduleRef = await Test.createTestingModule({
      providers: [
        SaleTransactionService,
        {
          provide: PrismaService,
          useValue: {
            saleTransaction: {
              findMany: findManyMock,
              create: createMock,
            },
          },
        },
      ],
    }).compile();

    saleTransactionService = moduleRef.get<SaleTransactionService>(
      SaleTransactionService,
    );
  });

  it('should be defined', () => {
    expect(saleTransactionService).toBeDefined();
  });

  describe('when the getTransactions function is called', () => {
    describe('and the getTransactions method returns the sale transactions', () => {
      let saleTransaction: SaleTransaction;

      beforeEach(() => {
        saleTransaction = {
          id: 1,
          description: 'Description',
          unitPrice: 5000,
          amount: 10,
          userId: 3,
        };
        findManyMock.mockResolvedValue(saleTransaction);
      });

      it('should return the sale transactions', async () => {
        const result = await saleTransactionService.getTransactions({
          userId: 3,
        });
        expect(result).toBe(saleTransaction);
      });
    });

    describe('and the getTransactions method is return empty value', () => {
      beforeEach(() => {
        findManyMock.mockResolvedValue([]);
      });

      it('should throw return empty arrays', async () => {
        const result = await saleTransactionService.getTransactions({
          userId: 3,
        });
        expect(result).toEqual([]);
      });
    });
  });

  describe('when the createTransaction function is called', () => {
    describe('and the createTransaction method create success', () => {
      let saleTransaction: SaleTransaction;

      beforeEach(() => {
        saleTransaction = {
          id: 1,
          description: 'Description',
          unitPrice: 5000,
          amount: 10,
          userId: 3,
        };
        createMock.mockResolvedValue(saleTransaction);
      });

      it('should create success and return the created sale transaction', async () => {
        const result = await saleTransactionService.createTransaction(
          mockUser,
          saleTransaction,
        );

        expect(result).toBe(saleTransaction);
      });
    });
  });
});
