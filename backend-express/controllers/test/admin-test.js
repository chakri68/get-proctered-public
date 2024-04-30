import { Router } from "express";
import prisma from "../../prisma/prisma.js";
import { getRandomCombination } from "../../services/test.js";

const router = Router();

router.post("/unban", async (req, res) => {
  const { testId, userId, eventIdx } = req.body;

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

  const events = bannedUser?.events || [];
  const event = events[eventIdx];

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  if (event.severity !== "error") {
    return res.status(400).json({
      message: "Invalid event",
    });
  }

  event.resolved = true;

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
      events: events,
    },
  });

  res.json({
    message: "User unbanned",
    data: session,
  });
});

router.post("/mark-resolved", async (req, res) => {
  const { testId, userId, eventIdx } = req.body;

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

  const ses = await prisma.testSession.findFirst({
    where: {
      testId,
      userId,
    },
  });

  if (!ses) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  const events = ses?.events || [];
  const event = events[eventIdx];

  if (!event || event.resolved) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  event.resolved = true;

  const session = await prisma.testSession.update({
    where: {
      id: ses.id,
    },
    data: {
      events: events,
    },
  });

  res.json({
    message: "Event resolved",
    data: session,
  });
});

router.post("/create", async (req, res) => {
  try {
    const { name, questions, generate, totalMarks, totalTime, startTime } =
      req.body;
    if (!Array.isArray(questions)) throw new Error("Invalid questions");

    const test = await prisma.test.create({
      data: {
        name,
        questions,
        generate,
        totalMarks,
        startTime: startTime,
        endTime: new Date(
          new Date(startTime).getTime() + totalTime * 60 * 1000
        ).toISOString(),
      },
    });

    res.json({
      message: "Test created",
      data: test,
    });
  } catch (err) {
    res.status(400).json({
      error: "Invalid request",
      message: err.message,
    });
  }
});

export default router;
