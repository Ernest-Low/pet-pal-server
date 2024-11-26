# Pet Pal Backend Server v1

### Typescript | Nodejs | Prisma

This repository hosts the backend server for the [**React Pet Pal**](https://github.com/Ernest-Low/react-pet-pal) project, developed as part of the NTU SCTP Project 1. While not a requirement for the project, this server was built to provide enhanced functionality and showcase a robust backend implementation.

## Built With

- **Languages & Frameworks**: TypeScript, Node.js, Express
- **ORM**: Prisma
- **Database**: PostgreSQL on AWS RDS
- **Authentication**: JSON Web Tokens (JWT)
- **Other Dependencies**:
  - `argon2` (Password hashing)
  - `joi` (Validation)
  - `cors` (Cross-Origin Resource Sharing)
  - `body-parser` (Request parsing)
  - `dotenv` (Environment variables)
  - `cloudinary` (File storage)

## Features

- Secure password hashing using `argon2`.
- Token-based authentication with **JWT**.
  - Default token expiration: **1 hour**.
  - **No refresh tokens** implemented.
- A robust schema design using **Prisma** ORM.
- Error responses structured for frontend integration.
- Cloudinary integration for media storage.
- Support for pagination in pet listing APIs.

## Full-Stack Expansion

While the original project requirements focused only on the frontend, this application was expanded into a full-stack solution to demonstrate both backend and frontend capabilities. The full-stack application uses:

- **React** for the frontend, providing an interactive and user-friendly interface.
- **TypeScript**, **Node.js**, and **Prisma** for the backend, delivering a robust and scalable API service.

### Prisma: A New Challenge

In this project, **Prisma** was a new ORM I worked with, and it provided a great opportunity to learn and implement modern database management techniques. Its type-safe database queries, schema-first approach, and integration with TypeScript significantly enhanced the development process. This learning experience allowed me to efficiently design and interact with a PostgreSQL database hosted on AWS RDS.

---

# API Documentation

## General Notes

- **Successful Responses**: Return `{ status: "Success" }` along with the usual payload.
- **Error Responses**: Return `{ status: "Error Code", message: "Error Details" }` for frontend error display.

---

## Authentication

### POST `/api/login`

**Request Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

**Response Body**
{
"payload": {
"owner": "ownerobj", // No password in ownerobj
"jwtToken": "JWT_TOKEN"
}
}

### POST `/api/register`

**Request Body**

```json
{
  "owner": "ownerobj" // No ownerID or ownerMatches in ownerobj
}
```

**Response Body**

```json
{
  "payload": {
    "jwtToken": "JWT_TOKEN",
    "owner": "ownerobj" // No password in ownerobj
  }
}
```

## Owner profile

### POST `/api/owner-profile`

**Request Body**

```json
{
  "jwtToken": "JWT_TOKEN"
}
```

**Response Body**

```json
{
  "payload": {
    "owner": "ownerobj" // No password in ownerobj
  }
}
```

### POST `/api/edit-profile`

**Request Body**

```json
{
  "jwtToken": "JWT_TOKEN",
  "owner": "ownerobj" // ownerMatches is optional
}
```

**Response Body**

```json
{
  "payload": {
    "owner": "ownerobj"
  }
}
```

### POST `/api/delete-profile`

**Request Body**

```json
{
  "jwtToken": "JWT_TOKEN",
  "password": "string"
}
```

**Response Body**

```json
{
  "status": "Account has been deleted" // For successful deletion
}
```

## Pets

### GET `/api/view-pet`

**Request Optional Query Parameters**

- page: number (default: 0)
- limit: number (default: 100)

**Response Body**

```json
{
  "payload": {
    "length": "number",
    "page": "number",
    "totalPages": "number",
    "owners": "ownerobj[]" // Each ownerobj includes petName, petGender, petAge, areaLocation, petPicture[1 entry], ownerId
  }
}
```

### GET `/api/view-pet/:id`

**Request Route Parameter**

- id (Owner id)

**Response Body**

```json
{
  "payload": {
    "owner": "ownerobj" // Includes petName, petGender, petAge, areaLocation, petPicture[], petDescription, ownerId
  }
}
```

## Matching

### POST `/api/match-profile`

**Request Body**

```json
{
  "jwtToken": "JWT_TOKEN",
  "targetId": "number" // targetId represents the ownerId of the owner to match
}
```

**Response Body - Match Success**:

```json
{
  "status": "Success, added match",
  "payload": {
    "owner": "ownerobj" // No password in ownerobj
  }
}
```

**Response Body - Already Matched: Remove Match**:

```json
{
  "status": "Success, removed match",
  "payload": {
    "owner": "ownerobj" // No password in ownerobj
  }
}
```

**Response Body - Match Success: Both Match**:

```json
{
  "status": "Success, both matched",
  "payload": {
    "owner": "ownerobj" // No password in ownerobj
  }
}
```

## Token Verification

### POST `/api/verify`

**Request Body**

```json
{
  "jwtToken": "JWT_TOKEN"
}
```

**Response Body**

```json
{
  "jwtToken": "JWT_TOKEN", // Refreshed JWT_TOKEN
  "owner": "ownerobj" // No password in ownerobj
}
```
