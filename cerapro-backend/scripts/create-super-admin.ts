import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value.trim();
}

const pool = new Pool({
  connectionString: getRequiredEnv('DATABASE_URL'),
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const phone = getRequiredEnv('SUPER_ADMIN_PHONE');
  const password = getRequiredEnv('SUPER_ADMIN_PASSWORD');

  if (password.length < 12) {
    throw new Error(
      'SUPER_ADMIN_PASSWORD doit contenir au moins 12 caractères.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingUser = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (existingUser) {
    const updatedAdmin = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        passwordHash,
        isKycVerified: true,
        phoneVerifiedAt: existingUser.phoneVerifiedAt ?? new Date(),
      },
      select: {
        id: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: updatedAdmin.id,
        action: 'BOOTSTRAP_SUPER_ADMIN_SYNCED',
        entity: 'User',
        entityId: updatedAdmin.id,
        metadata: {
          phone: updatedAdmin.phone,
          role: updatedAdmin.role,
          syncedAt: new Date().toISOString(),
        },
      },
    });

    console.log('SUPER_ADMIN synchronisé avec succès.');
    console.log(updatedAdmin);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      phone,
      passwordHash,
      firstName: 'CERAPRO',
      lastName: 'SUPER ADMIN',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isKycVerified: true,
      phoneVerifiedAt: new Date(),
      profile: {
        create: {
          country: 'Cameroun',
        },
      },
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'BOOTSTRAP_SUPER_ADMIN_CREATED',
      entity: 'User',
      entityId: admin.id,
      metadata: {
        phone: admin.phone,
        role: admin.role,
        createdAt: new Date().toISOString(),
      },
    },
  });

  console.log('SUPER_ADMIN créé avec succès.');
  console.log(admin);
}

main()
  .catch((error) => {
    console.error('CREATE_SUPER_ADMIN_FAILED', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });