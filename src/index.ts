import express, { Express, Request, Response } from "express";
import { config } from "./config/config";
import prisma from "../prisma/db/prisma";
import {
  LoginController,
  RegisterController,
  refreshToken,
  ViewPetsController,
  ViewPetController,
  OwnerProfileController,
  EditProfileController,
  DeleteProfileController,
  MatchProfileController
} from "./controllers/Controllers";
import AuthCheck from "./middleware/AuthCheck";
import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import ErrorHandling from "./middleware/ErrorHandling";

const app: Express = express();

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors(corsOptions));
app.use(ErrorHandling);

app.listen(config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${config.PORT}`);
});

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/api/register", RegisterController); // ? Send Whole owner profile minus ownerMatches (don't save this in), return jwtToken and ownerobj (-password)
  app.post("/api/login", LoginController); // ? Send email password, return jwtToken and ownerobj (-password)
  app.post("/api/owner-profile", AuthCheck, OwnerProfileController); // ? Send jwtToken, returns ownerobj (-password)
  app.post("/api/edit-profile", AuthCheck, EditProfileController); // ? Send ownerobj (password optional, -matches). Returns ownerobj (-password)
  app.get("/api/view-pet", ViewPetsController); // ?  Return a number of owner profiles ( petname, petGender, petAge, areaLocation, petPicture[0] )
  app.get("/api/view-pet/:id", ViewPetController); // ? Return corresponding owner ID's (public profile) - ( petName, petGender, petAge, areaLocation, petPicture[], petDescription )
  app.post("/api/delete-profile", AuthCheck, DeleteProfileController); // ? Send jwtToken and password - Deletes user from database, returns success
  app.post("/api/match-profile", AuthCheck, MatchProfileController) // ? Send jwtToken and targetId, handles matching logic, returns success and ownerobj (-password)

  app.post("/api/verify", AuthCheck, refreshToken); // ? Send jwtToken, returns jwtToken and ownerobj (-password)
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
