import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  hotelCreate,
  createTicket,
  createUser,
  ticketPassHotels,
  ticketNotPassHotels,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when there is no enrollment to user", async () => {
      const token = await generateValidToken();
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 404 when user doesnt have valid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should respond with status 401 when ticket is reserved or dont includes Hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketNotPassHotels();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 402 when the ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketPassHotels();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    describe("when ticket is paid", async () => {
      it("should respond with status 200 and empty array when there are no hotels", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await ticketPassHotels();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([]);
      });
      it("should respond with status 200 when there are hotels", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await ticketPassHotels();
        const hotel = await hotelCreate();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updateAt: hotel.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });
});
