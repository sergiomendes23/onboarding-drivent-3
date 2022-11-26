import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Hotel } from "@prisma/client";
import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotelsService(userId: number): Promise<Hotel[]> {
  const user = await verifyUser(userId);
  const validTicket = await ticketRepository.findTicketByEnrollmentId(user);

  if (!validTicket) {
    throw notFoundError();
  }
  if (!validTicket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
  if (!validTicket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  if (validTicket.status === "RESERVED") {
    throw invalidDataError;
  }

  return hotelsRepository.getHotelsRepository();
}

async function verifyUser(userId: number) {
  const user = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!user) {
    throw unauthorizedError;
  }

  return user.id;
}

async function getRoomsHotelsService(userId: number, hotelId: string) {
  const user = await verifyUser(userId);
  const validTicket = await ticketRepository.findTicketByEnrollmentId(user);
  const validHotelId = Number(hotelId);

  if (!validTicket) {
    throw notFoundError();
  }
  if (!validTicket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
  if (!validTicket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  if (validTicket.status === "RESERVED") {
    throw invalidDataError;
  }
  if (!validHotelId) {
    throw notFoundError();
  }

  const roomsHotels = await hotelsRepository.getRoomsHotelsRepository(validHotelId);

  if (roomsHotels.length === 0) {
    throw notFoundError();
  }

  return roomsHotels;
}

const hotelsService = {
  getHotelsService,
  getRoomsHotelsService,
};

export default hotelsService;
