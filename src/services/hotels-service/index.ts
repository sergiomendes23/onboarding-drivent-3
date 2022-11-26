import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Hotel } from "@prisma/client";
import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotelsService(userId: number): Promise<Hotel[]> {
  const user = await verifyUser(userId);
  const validTicket = await ticketRepository.findTicketByEnrollmentId(user);

  if(!validTicket) {
    throw notFoundError;
  }
  if(!validTicket.TicketType.includesHotel) {
    throw notFoundError;
  }
  if(!validTicket.TicketType.isRemote) {
    throw notFoundError;
  }
  if(validTicket.status === "RESERVED") {
    throw invalidDataError;
  }
  
  return hotelsRepository.getHotelsRepository();
}

async function verifyUser(userId: number) {
  const user = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!user) {
    throw unauthorizedError;
  }

  return user.id;
}

const hotelsService = {
  getHotelsService,
};
  
export default hotelsService;
