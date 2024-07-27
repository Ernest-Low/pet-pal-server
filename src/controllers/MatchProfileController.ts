import { Request, Response } from "express";
import prisma from "../../prisma/db/prisma";

const MatchProfileController = async (req: Request, res: Response) => {
  try {
    const email = req.email?.email;
    const targetId: number = req.body?.targetId;

    if (!targetId) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing targetId" });
    }

    const requestUser = await prisma.owner.findUnique({
      where: { email },
      select: {
        ownerId: true,
        ownerMatches: true,
      },
    });

    if (!requestUser) {
      return res.status(404).json({ status: "Requesting user not found" });
    }
    if (targetId === requestUser.ownerId) {
      return res.status(403).json({ status: "You can't match yourself" });
    }
    if (requestUser.ownerMatches.includes(targetId)) {
      const newMatches = requestUser.ownerMatches.toSpliced(
        requestUser.ownerMatches.indexOf(targetId),
        1
      );
      const newUser = await prisma.owner.update({
        where: {
          ownerId: requestUser.ownerId,
        },
        data: {
          ownerMatches: newMatches,
        },
      });
      const { password, ...resUser } = newUser;
      return res.status(200).json({
        status: "Success, removed match",
        payload: { owner: resUser },
      });
    }

    const targetUser = await prisma.owner.findUnique({
      where: {
        ownerId: targetId,
      },
      select: {
        ownerMatches: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({ status: "Target user not found" });
    }

    const newMatches = [...requestUser.ownerMatches];
    newMatches.push(targetId);
    const newUser = await prisma.owner.update({
      where: {
        ownerId: requestUser.ownerId,
      },
      data: {
        ownerMatches: newMatches,
      },
    });
    const { password, ...resUser } = newUser;
    if (!targetUser.ownerMatches.includes(requestUser.ownerId)) {
      return res
        .status(200)
        .json({ status: "Success, both matched", payload: { owner: resUser } });
    } else {
      return res
        .status(200)
        .json({ status: "Success, added match", payload: { owner: resUser } });
    }
  } catch (err) {
    console.error("Error updating owner:", err); // Log error for debugging
    return res.status(500).json({ status: "Internal server error" });
  }
};

export default MatchProfileController;

// POST - /api/match-profile
// Request: { jwtToken: JWT_TOKEN, targetId: number }                                                               // targetId represents the ownerId of owner to match
// Response: Match Success:                { status: "Success, added match", payload: { owner: ownerobj }}          // No password in ownerobj
//           Already matched: Remove Match { status: "Success, removed match", payload: { owner: ownerobj }}        // No password in ownerobj
//           Match Success: Both Match:    { status: "Success, both matched", payload: { owner: ownerobj }}         // No password in ownerobj
