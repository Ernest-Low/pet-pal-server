import express, { Express, Request, Response } from "express";
import { config } from "./config/config";
import prisma from "../prisma/db/prisma";
import {
  LoginController,
  RegisterController,
  protectedRoute,
  ViewPetsController,
  ViewPetController,
  OwnerProfileController,
  EditProfileController,
} from "./controllers/Controllers";
import AuthCheck from "./middleware/AuthCheck";
import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import ErrorHandling from "./middleware/ErrorHandling";

const app: Express = express();

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(ErrorHandling);

app.listen(config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${config.PORT}`);
});

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/api/register", RegisterController); // ? Send Whole owner profile minus ownerMatches (don't save this in), return whole owner profile
  app.post("/api/login", LoginController); // ? Send email password, return whole ownerprofile, and JWT save into localstorage
  app.post("/api/owner-profile", AuthCheck, OwnerProfileController); // ? Send JWT in body. Checks JWT, use corresponding email from JWT to return whole ownerprofile
  app.post("/api/edit-profile", AuthCheck, EditProfileController); // ? Send whole owner profileEdit profile    ( all fields, except ownerMatches). Returns full ownerprofile that was saved. +ownermatches
  app.get("/api/view-pet", ViewPetsController); // ?  Return a number of owner profiles ( petname, petGender, petAge, areaLocation, petPicture[0] )
  app.get("/api/view-pet/:id", ViewPetController); // ? Return corresponding owner ID's (public profile) - ( petName, petGender, petAge, areaLocation, petPicture[], petDescription )

  app.post("/api/protected", AuthCheck, protectedRoute); // Route just to verify JWT validity
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
