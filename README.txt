Server for react-pet-pal project for NTU SCTP Project 1
Not a requirement for the project but I wanted to make one

Stack / Dependencies:
NodeJS, Typescript, Prisma, Express, argon2, joi, jsonwebtoken, cors, body-parser, dot-env

JWT Stored in localstorage, not sure how to work out CORS with hosting websites + cookies
Did not add a refresh token, default timeout 1h

APIs
/api/login
/api/register
/api/owner-profile
/api/edit-profile
/api/view-pet
/api/view-pet/:id


Responses come with a { status: "Success" } or the like

POST - /api/login
Request : { email: string, password: string; }
Response: { payload: { owner: ownerobj, jwtToken: JWT_TOKEN }}                        // No password in ownerobj

POST - /api/register
Request: { owner: ownerobj }                                                          // No ownerID / ownerMatches in ownerobj
Response: { payload: { owner: ownerobj }}                                             // No password in ownerobj

POST - /api/owner-profile
Request: { jwtToken: JWT_TOKEN }
Response: { payload: { owner: ownerobj }}                                             // No password in ownerobj

POST - /api/edit-profile
Request: { jwtToken: JWT_TOKEN, owner: ownerobj }                                     // ownerMatches optional
Response: { payload: { owner: ownerobj }}

GET - /api/view-pet
Request: Optional Query Params: ( page: number, limit: number ) - Default page: 0, limit: 100
Response: { payload: { length: number, page: number, totalPages: number, owners: ownerobj[] }}          // ownerobj consists of: petname, petGender, petAge, areaLocation, petPicture[1 entry], ownerId 

GET - /api/view-pet/:id
Request: Route Param :id
Response: { payload: { owner: ownerobj }}                                             // ownerobj consists of: petName, petGender, petAge, areaLocation, petPicture[], petDescription, ownerId 