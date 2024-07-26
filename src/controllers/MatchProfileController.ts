import { Request, Response } from "express";
import prisma from "../../prisma/db/prisma";

// POST - /api/match-profile
// Request: { jwtToken: JWT_TOKEN, targetId: number }                                                               // targetId represents the ownerId of owner to match
// Response: Match Success:                { status: "Success, added match", payload: { owner: ownerobj }}          // No password in ownerobj
//           Already matched: Remove Match { status: "Success, removed match", payload: { owner: ownerobj }}        // No password in ownerobj
//           Match Success: Both Match:    { status: "Success, both matched", payload: { owner: ownerobj }}         // No password in ownerobj

const MatchProfileController = async (req: Request, res: Response) => {
  try {
    const email = req.email?.email;
    const targetId: number = req.body?.targetId;

    if (!targetId) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing targetId" });
    }

    const foundUser = await prisma.owner.findUnique({
      where: {
        ownerId: targetId,
      },
      select: {
        password: true,
      },
    });

    if (!foundUser) {
      return res.status(404).json({ status: "No user found?" });
    }
  } catch (err) {
    console.error("Error updating owner:", err); // Log error for debugging
    return res.status(500).json({ status: "Internal server error" });
  }
};

export default MatchProfileController;
