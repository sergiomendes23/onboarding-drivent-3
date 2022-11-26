import { prisma } from "@/config";

function getHotelsRepository() {
  return prisma.hotel.findMany();
}

function getRoomsHotelsRepository(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
    include: {
      Hotel: true,
    },
  });
}

const hotelsRepository = {
  getHotelsRepository,
  getRoomsHotelsRepository,
};

export default hotelsRepository;
