import { prisma } from "@/config";

function getHotelsRepository() {
  return prisma.hotel.findMany();
}

function getRoomsHotelsRepository(hotelId: number) {
  return prisma.hotel.findMany({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getHotelsRepository,
  getRoomsHotelsRepository,
};

export default hotelsRepository;
