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
Response: { payload: { owner: ownerobj, jwtToken: JWT_TOKEN }}                                                   // No password in ownerobj

POST - /api/register
Request: { owner: ownerobj }                                                                                     // No ownerID / ownerMatches in ownerobj
Response: { payload: { jwtToken: JWT_TOKEN, owner: ownerobj }}                                                   // No password in ownerobj

POST - /api/owner-profile
Request: { jwtToken: JWT_TOKEN }
Response: { payload: { owner: ownerobj }}                                             

POST - /api/edit-profile
Request: { jwtToken: JWT_TOKEN, owner: ownerobj }                                                                // ownerMatches optional
Response: { payload: { owner: ownerobj }}

GET - /api/view-pet
Request: Optional Query Params: ( page: number, limit: number ) - Default page: 0, limit: 100
Response: { payload: { length: number, page: number, totalPages: number, owners: ownerobj[] }}                   // ownerobj consists of: petname, petGender, petAge, areaLocation, petPicture[1 entry], ownerId 

GET - /api/view-pet/:id
Request: Route Param :id
Response: { payload: { owner: ownerobj }}                                                                        // ownerobj consists of: petName, petGender, petAge, areaLocation, petPicture[], petDescription, ownerId

POST - /api/delete-profile
Request: { jwtToken: JWT_TOKEN, password: string }
Response: { status: "Account has been deleted" }                                                                 // For success cases

POST - /api/match-profile
Request: { jwtToken: JWT_TOKEN, targetId: number }                                                               // targetId represents the ownerId of owner to match
Response: Match Success:                { status: "Success, added match", payload: { owner: ownerobj }}          // No password in ownerobj
          Already matched: Remove Match { status: "Success, removed match", payload: { owner: ownerobj }}        // No password in ownerobj
          Match Success: Both Match:    { status: "Success, both matched", payload: { owner: ownerobj }}         // No password in ownerobj


