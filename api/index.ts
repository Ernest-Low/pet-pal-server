import express, { Express, Request, Response } from "express";
import { config } from "../config/config";
import prisma from "../prisma/db/prisma";
import {
  LoginController,
  RegisterController,
  protectedRoute,
} from "../src/controllers/Controllers";
import AuthCheck from "../src/middleware/AuthCheck";
import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "../config/corsOptions";

const app: Express = express();

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.listen(config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${config.PORT}`);
});

const main = async () => {
  // const owners = await prisma.owner.findMany({
  //   where: {
  //     petAge: {
  //       gt: 5,
  //     },
  //   },
  //   select: {
  //     petName: true,
  //     petGender: true,
  //     petAge: true,
  //     areaLocation: true,
  //     petPicture: true,
  //   },
  // });
  // console.dir(owners);

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/api/register", RegisterController); // ? Send Whole owner profile minus ownerMatches (don't save this in), return whole owner profile
  app.post("/api/login", LoginController); // ? Send username password, return whole ownerprofile, and JWT save into localstorage

  // POST   /api/owner-profile     -> Protected. Send JWT in body. Checks JWT, use corresponding email from JWT to return whole ownerprofile
  // POST   /api/edit-profile      -> Protected. Send whole owner profileEdit profile    ( all fields, except ownerMatches). Returns full ownerprofile that was saved. +ownermatches
  // GET    /api/view-pet         -> Return a number of owner profiles                  ( petname, petGender, petAge, areaLocation, petPicture[0] )
  // GET    /api/view-pet:id      -> Return corresponding owner ID's (public profile) - ( petName, petGender, petAge, areaLocation, petPicture[], petDescription )

  app.get("/api/protected", AuthCheck, protectedRoute); // Test route. AuthCheck the middleware can be placed on any of the routes that require a logged in user
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
