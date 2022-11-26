import { prisma } from "@/config";

function getHotelsRepository() {
  return prisma.hotel.findMany();
}

function getRoomsHotels(hotelId: number) {
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
  getRoomsHotels,
};

export default hotelsRepository;
