import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Hotel, TicketStatus } from "@prisma/client";
import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotelsService(userId: number): Promise<Hotel[]> {
  const user = await verifyUser(userId);
  const validTicket = await ticketRepository.findTicketByEnrollmentId(user);

  if (!validTicket || !user) {
    throw notFoundError();
  }
  if (!validTicket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
  if (validTicket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  if (validTicket.status === TicketStatus.RESERVED) {
    throw invalidDataError;
  }

  return await hotelsRepository.getHotelsRepository();
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
  const validHotel = await hotelsRepository.getRoomsHotelsRepository(Number(hotelId));

  if (!validTicket || !user) {
    throw notFoundError();
  }
  if (!validTicket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
  if (validTicket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  if (validTicket.status === TicketStatus.RESERVED) {
    throw invalidDataError;
  }
  if (!validHotel) {
    throw notFoundError();
  }

  return validHotel;
}

const hotelsService = {
  getHotelsService,
  getRoomsHotelsService,
};

export default hotelsService;
