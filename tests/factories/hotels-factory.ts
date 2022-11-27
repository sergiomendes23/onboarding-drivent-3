import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function hotelCreate() {
  return prisma.hotel.create({
    data: {
      id: faker.datatype.number({ min: 1, max: 100 }),
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });
}
