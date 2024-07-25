import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/db/prisma";

const ViewPetsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Read page and limit from query params
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    // Set default page to 0 and limit to 10 if not provided or invalid
    const currentPage = isNaN(page) || page < 0 ? 0 : page;
    const currentLimit = isNaN(limit) || limit <= 0 ? 100 : limit;

    // Calculate start index for pagination
    const startIndex = currentPage * currentLimit;

    // Fetch paginated data and total count using raw SQL
    const owners: {
      ownerId: string;
      petName: string;
      petGender: "Male" | "Female";
      petAge: number;
      areaLocation: string;
      petPicture: string[];
    }[] = await prisma.$queryRaw`
      SELECT 
        "ownerId",
        "petName",
        "petGender",
        "petAge",
        "areaLocation",
        ARRAY(SELECT unnest("petPicture") LIMIT 1) AS "petPicture"
      FROM 
        "petpal"."owner"
      OFFSET ${startIndex} LIMIT ${currentLimit}
    `;

    const totalItems = await prisma.owner.count();

    // Check if the requested page is out of range
    if (startIndex >= totalItems && totalItems > 0) {
      return res.status(404).json({ error: "Page not found." });
    }

    // Send the paginated items as the response
    return res.json({
      length: owners.length,
      page: currentPage,
      totalPages: Math.ceil(totalItems / currentLimit),
      owners,
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export default ViewPetsController;
