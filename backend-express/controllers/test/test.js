import { Router } from "express";
import prisma from "../../prisma/prisma.js";
import checkAuth from "../../middleware/auth.js";
import multer from "multer";
import { compareFaceToDescriptor } from "../../services/check-face.js";
import { checkUserTest } from "../../services/test.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// Middleware to check if the user is authenticated
router.use(checkAuth);

router.post("/:id/start-test", upload.single("face"), async (req, res) => {
  try {
    if (!req.user) throw new Error("Not Authorized");
    const { id: userId } = req.user;
    const file = req.file;

    if (!file) {
      throw new Error("Invalid request body");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const matches = await compareFaceToDescriptor(
      file.buffer,
      new Float32Array(user.faceDescriptors)
    );

    if (!matches) throw new Error("Faces don't match");

    const { id } = req.params;
    if (!user) throw new Error("Not Authorized");

    const test = await prisma.test.findUnique({
      where: {
        id,
      },
    });

    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    // Check if the user is allowed to take the test
    const { data, error } = await checkUserTest(id, userId);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    // Check if a test session already exists
    const testSession = await prisma.testSession.findFirst({
      where: {
        testId: id,
        status: "IN_PROGRESS",
      },
    });

    if (testSession) {
      const prevEvents = testSession.events || [];
      if (!Array.isArray(prevEvents)) {
        return res.status(400).json({
          message: "Invalid test session",
        });
      }
      // Store it as an event
      await prisma.testSession.update({
        where: {
          id: testSession.id,
        },
        data: {
          events: [
            {
              type: "SESSION_RESTART",
              timestamp: new Date(),
            },
            ...prevEvents,
          ],
        },
      });

      return res.status(400).json({
        message: "Test session already in progress",
      });
    }

    const session = await prisma.testSession.create({
      data: {
        testId: id,
        status: "IN_PROGRESS",
        events: [
          {
            type: "SESSION_START",
            timestamp: new Date(),
          },
        ],
        answers: [],
        startTime: new Date(),
        endTime: null,
        userId: userId,
      },
    });

    return res.json({
      message: "Test session started",
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.post("/:id/submit-answer", async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const user = req.user;
    if (!user) throw new Error("Not Authorized");

    // Check if the user is allowed to take the test
    const { data, error } = await checkUserTest(id, user.id);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const testSession = await prisma.testSession.findFirst({
      where: {
        testId: id,
        status: "IN_PROGRESS",
        userId: user.id,
      },
    });

    if (!testSession) {
      return res.status(400).json({
        message: "Test session not found",
      });
    }

    const { answers } = testSession;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid test session",
      });
    }

    const updatedAnswers = [
      ...answers,
      {
        answer,
        timestamp: new Date(),
      },
    ];

    await prisma.testSession.update({
      where: {
        id: testSession.id,
      },
      data: {
        answers: updatedAnswers,
      },
    });

    res.json({
      message: "Answer submitted",
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) throw new Error("Not Authorized");

    // Check if the user is allowed to take the test
    const { data, error } = await checkUserTest(id, user.id);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const test = await prisma.test.findUnique({
      where: {
        id,
      },
    });

    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    res.json({
      message: "Test found",
      data: test,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Not Authorized");

    const tests = await prisma.testTaker.findMany({
      where: {
        userId: user.id,
      },
      select: {
        test: true,
      },
    });

    res.json({
      message: "Tests found",
      data: tests.map((test) => test.test),
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.get("/:id/end-test", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) throw new Error("Not Authorized");

    // Check if the user is allowed to take the test
    const { data, error } = await checkUserTest(id, user.id);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const testSession = await prisma.testSession.findFirst({
      where: {
        testId: id,
        status: "IN_PROGRESS",
        userId: user.id,
      },
    });

    if (!testSession) {
      return res.status(400).json({
        message: "Test session not found",
      });
    }

    const prevEvents = testSession.events || [];
    if (!Array.isArray(prevEvents)) {
      return res.status(400).json({
        message: "Invalid test session",
      });
    }

    await prisma.testSession.update({
      where: {
        id: testSession.id,
      },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        events: [
          ...prevEvents,
          {
            type: "SESSION_END",
            timestamp: new Date(),
          },
        ],
      },
    });

    res.json({
      message: "Test session ended",
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

/**
 * Route to check if the test is being administered correctly
 */
router.post("/:id/ping", upload.single("face"), async (req, res) => {
  try {
    const testId = req.params.id;
    if (!req.user) throw new Error("Invalid test id");
    const { id: userId } = req.user;
    const file = req.file;
    if (!file) {
      throw new Error("Invalid request body");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const testSession = await prisma.testSession.findFirst({
      where: {
        testId,
        userId,
        status: "IN_PROGRESS",
      },
    });

    if (!testSession) {
      return res.status(400).json({
        message: "Test session not found",
      });
    }

    const prevEvents = testSession.events || [];

    if (!Array.isArray(prevEvents)) {
      return res.status(400).json({
        message: "Invalid test session",
      });
    }

    // Check face
    const matches = await compareFaceToDescriptor(
      file.buffer,
      new Float32Array(user.faceDescriptors)
    );

    if (!matches) {
      await prisma.testSession.update({
        where: {
          id: testSession.id,
        },
        data: {
          status: "SUSPENDED",
          events: [
            ...prevEvents,
            {
              type: "SESSION_SUSPENDED",
              timestamp: new Date(),
            },
          ],
        },
      });

      throw new Error("Faces don't match");
    }
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, questions } = req.body;
    const user = req.user;
    if (!user) throw new Error("Not Authorized");
    if (!Array.isArray(questions)) throw new Error("Invalid questions");

    const { id: userId } = user;

    const test = await prisma.test.create({
      data: {
        name,
        questions,
        userId,
      },
    });

    res.json({
      message: "Test created",
      data: test,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

export default router;