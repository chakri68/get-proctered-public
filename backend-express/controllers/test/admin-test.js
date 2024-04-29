import { Router } from "express";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.post("/unban", async (req, res) => {
  const { testId, userId } = req.body;

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
  });

  if (!test) {
    return res.status(404).json({
      message: "Test not found",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const bannedUser = await prisma.testSession.findFirst({
    where: {
      testId,
      userId,
      status: "BANNED",
    },
  });

  if (!bannedUser) {
    return res.status(404).json({
      message: "User not banned",
    });
  }

  const session = await prisma.testSession.update({
    where: {
      id: bannedUser.id,
    },
    data: {
      status: "IN_PROGRESS",
    },
  });

  res.json({
    message: "User unbanned",
    data: session,
  });
});

export default router;