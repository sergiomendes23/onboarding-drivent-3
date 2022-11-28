import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function hotelCreate() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });
}

export async function roomHotelCreate(hotelId: number) {
  return prisma.room.create({
    data: {
      id: faker.datatype.number({ min: 1, max: 100 }),
      name: faker.name.findName(),
      capacity: faker.datatype.number({ min: 1, max: 10 }),
      hotelId,
      updatedAt: new Date(),
    }
  });
}
