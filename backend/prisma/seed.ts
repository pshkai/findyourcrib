import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash(
    'password123',
    10,
  );

  const agent = await prisma.user.upsert({
    where: {
      email: 'agent@test.com',
    },

    update: {},

    create: {
      name: 'Demo Agent',
      email: 'agent@test.com',
      password: hashedPassword,
      role: 'AGENT',
      phoneNumber: '0811199612',
    },
  });

  await prisma.property.createMany({
    data: [
      {
        title: 'Luxury Condo Bangkok',
        description:
          'Modern luxury condo near BTS Asok with gym and pool.',
        price: 25000,
        propertyType: 'CONDO',
        bedrooms: 2,
        bathrooms: 1,
        sizeSqm: 45,
        address: 'สุขุมวิท 21',
        township: 'Bangkok',
        nearestStation: 'BTS Asok',
        distanceToStation: 0.3,
        status: 'AVAILABLE',
        verificationStatus: true,
        agentId: agent.id,
      },
      {
        title: 'Modern Apartment Chiang Mai',
        description:
          'Affordable apartment near Nimman area.',
        price: 12000,
        propertyType: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        sizeSqm: 32,
        address: 'Nimman Road',
        township: 'Chiang Mai',
        nearestStation: 'Airport',
        distanceToStation: 3,
        status: 'AVAILABLE',
        verificationStatus: true,
        agentId: agent.id,
      },
      {
        title: 'Pool Villa Phuket',
        description:
          'Private luxury villa with sea view and swimming pool.',
        price: 95000,
        propertyType: 'VILLA',
        bedrooms: 4,
        bathrooms: 3,
        sizeSqm: 280,
        address: 'Mai Khao Beach',
        township: 'Phuket',
        nearestStation: 'Phuket International Airport',
        distanceToStation: 20,
        status: 'AVAILABLE',
        verificationStatus: true,
        agentId: agent.id,
      },
    ],
  });

  console.log('Database seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });