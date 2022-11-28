import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function hotelCreate() {
  return prisma.hotel.create({
    data: {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });
}

export async function roomHotelCreate(hotelId: number) {
  return prisma.room.create({
    data: {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId,
      updatedAt: new Date(),
    }
  });
}
