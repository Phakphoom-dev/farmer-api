import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await argon.hash('admin'),
      firstname: 'System',
      lastname: 'Admin',
      role: {
        create: {
          rolename: 'admin',
        },
      },
    },
  });

  await seedUsers();
  await seedGAP();
  await seedGMP();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seedUsers() {
  const clientRow = await prisma.role.upsert({
    where: { rolename: 'farmer' },
    update: {},
    create: {
      rolename: 'farmer',
    },
  });

  const countUserRow = await prisma.user.count();

  if (countUserRow < 3000) {
    for (let i = 1; i <= 3000; i++) {
      const username = `farmer_${i}`;
      const password = await argon.hash(`farmer_${i}`);
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();

      await prisma.user.create({
        data: {
          username,
          password,
          firstname,
          lastname,
          roleId: clientRow.id,
        },
      });
    }
  }
}

async function seedGAP() {
  const countGapRow = await prisma.goodAgriculturalPractice.count();

  if (countGapRow < 3000) {
    for (let i = 1; i <= 3000; i++) {
      const description = faker.string.alpha(25);

      await prisma.goodAgriculturalPractice.create({
        data: {
          description,
        },
      });
    }
  }
}

async function seedGMP() {
  const countGmpRow = await prisma.goodManufacturingPractice.count();

  if (countGmpRow < 1000) {
    for (let i = 1; i <= 3000; i++) {
      const description = faker.string.alpha(25);

      await prisma.goodManufacturingPractice.create({
        data: {
          description,
        },
      });
    }
  }
}
