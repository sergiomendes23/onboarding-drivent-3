import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";
import { Hotel } from "@prisma/client";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels: Hotel[] = await hotelsService.getHotelsService(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
  }
}

export async function getRoomsHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  try {
    const roomsHotels = await hotelsService.getRoomsHotelsService(userId, hotelId);
    return res.status(httpStatus.OK).send(roomsHotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "invalidDataError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error);
    }
  }
}
