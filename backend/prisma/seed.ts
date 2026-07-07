import { PrismaClient, PropertyType, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@findyourcrib.test" },
    update: {},
    create: {
      name: "FindYourCrib Admin",
      email: "admin@findyourcrib.test",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@findyourcrib.test" },
    update: {},
    create: {
      name: "Mali Homes",
      email: "agent@findyourcrib.test",
      passwordHash,
      phoneNumber: "+66 80 000 0000",
      role: UserRole.AGENT
    }
  });

  const renter = await prisma.user.upsert({
    where: { email: "renter@findyourcrib.test" },
    update: {},
    create: {
      name: "Demo Renter",
      email: "renter@findyourcrib.test",
      passwordHash,
      role: UserRole.RENTER
    }
  });

  const listings = [
    {
      id: "11111111-1111-4111-8111-111111111111",
      title: "Sathorn skyline condo near BTS",
      description: "A bright two-bedroom condo with city views, secure lobby, pool, gym, and quick access to central Bangkok offices.",
      price: 42000,
      propertyType: PropertyType.CONDO,
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 72,
      address: "Sathorn Road",
      township: "Sathorn",
      province: "Bangkok",
      latitude: 13.721,
      longitude: 100.529,
      nearestStation: "BTS Chong Nonsi",
      distanceToStation: 0.45,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      title: "Bright studio beside Phrom Phong",
      description: "Compact, well-managed studio near EmQuartier with furnished interiors, fast internet options, and easy BTS access.",
      price: 23000,
      propertyType: PropertyType.APARTMENT,
      bedrooms: 1,
      bathrooms: 1,
      sizeSqm: 38,
      address: "Sukhumvit Road",
      township: "Watthana",
      province: "Bangkok",
      latitude: 13.730,
      longitude: 100.569,
      nearestStation: "BTS Phrom Phong",
      distanceToStation: 0.3,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      title: "Private pool villa in Rawai",
      description: "A quiet three-bedroom villa with private pool, covered parking, open kitchen, and easy drives to beaches and cafes.",
      price: 88000,
      propertyType: PropertyType.VILLA,
      bedrooms: 3,
      bathrooms: 3,
      sizeSqm: 210,
      address: "Rawai Beach area",
      township: "Rawai",
      province: "Phuket",
      latitude: 7.779,
      longitude: 98.325,
      nearestStation: "Rawai Pier",
      distanceToStation: 2.2,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  for (const listing of listings) {
    await prisma.property.upsert({
      where: { id: listing.id },
      update: {},
      create: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        propertyType: listing.propertyType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        sizeSqm: listing.sizeSqm,
        address: listing.address,
        township: listing.township,
        province: listing.province,
        latitude: listing.latitude,
        longitude: listing.longitude,
        nearestStation: listing.nearestStation,
        distanceToStation: listing.distanceToStation,
        status: "AVAILABLE",
        verificationStatus: "VERIFIED",
        isFeatured: listing.isFeatured,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastConfirmedAt: new Date(),
        agentId: agent.id,
        images: {
          create: {
            imageUrl: listing.imageUrl,
            altText: listing.title,
            displayOrder: 0
          }
        }
      }
    });
  }

  await prisma.favorite.upsert({
    where: {
      userId_propertyId: {
        userId: renter.id,
        propertyId: listings[0].id
      }
    },
    update: {},
    create: {
      userId: renter.id,
      propertyId: listings[0].id
    }
  });

  console.log(`Seed complete: admin=${admin.email}, agent=${agent.email}, renter=${renter.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
