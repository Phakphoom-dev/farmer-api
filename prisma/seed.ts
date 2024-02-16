import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({
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

  const clientRow = await prisma.role.upsert({
    where: { rolename: 'farmer' },
    update: {},
    create: {
      rolename: 'farmer',
    },
  });

  console.log({ admin, clientRow });
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
