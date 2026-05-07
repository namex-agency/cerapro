import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value.trim();
}

async function main() {
  const phone = getRequiredEnv('SUPER_ADMIN_PHONE');
  const password = getRequiredEnv('SUPER_ADMIN_PASSWORD');

  if (password.length < 12) {
    throw new Error(
      'SUPER_ADMIN_PASSWORD doit contenir au moins 12 caractères.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (existingAdmin) {
    if (existingAdmin.role !== UserRole.SUPER_ADMIN) {
      await prisma.user.update({
        where: {
          id: existingAdmin.id,
        },
        data: {
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          passwordHash,
          phoneVerifiedAt: existingAdmin.phoneVerifiedAt ?? new Date(),
        },
      });

      console.log('Utilisateur existant promu SUPER_ADMIN.');
      return;
    }

    console.log('SUPER_ADMIN déjà existant. Aucune création nécessaire.');
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
  console.log({
    id: admin.id,
    phone: admin.phone,
    role: admin.role,
    status: admin.status,
  });
}

main()
  .catch((error) => {
    console.error('CREATE_SUPER_ADMIN_FAILED', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });