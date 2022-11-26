import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getRoomsHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getRoomsHotels);

export { hotelsRouter };
