import { Router } from "express";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Get all tests
    const tests = await prisma.test.findMany({
      include: {
        TestTaker: true,
      },
    });

    const testsWithAverage = await Promise.all(
      tests.map(async (test) => {
        const testSessions = await prisma.testSession.findMany({
          where: {
            testId: test.id,
          },
          include: {
            test: true,
          },
        });

        if (testSessions.length === 0) {
          return { ...test, averageMarks: 0, averageDuration: 0, students: 0};
        }

        let totalMarks = 0;
        let totalDuration = 0;

        testSessions.forEach((session) => {
          const marks = calculateMarks(session.answers, session.test.questions);
          totalMarks += marks;
          totalDuration +=
            new Date(session.endTime) - new Date(session.startTime);
        });

        const averageMarks = totalMarks / testSessions.length;
        const averageDuration = totalDuration / (testSessions.length * 1000 * 60); // Convert milliseconds to minutes

        return { ...test, averageMarks, averageDuration,students: testSessions.length};
      })
    );

    console.log(testsWithAverage);

    return res.json({
      testsWithAverage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});


// delete test having id = testId

router.post("/deleteTest/:id", async (req, res) => {
  try{
    const {id: testId} = req.params;
    const test = await prisma.test.delete({
      where: {
        id: testId,
      },
    });
    return res.json({
      test,
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
);

router.get("/getTest/:id", async (req, res) => {
  try {
    const { id: testId } = req.params;
    const testSessions = await prisma.testSession.findMany({
      where: {
        testId: testId,
      },
      include: {
        user: true,
        test: true
      },
    });
    // calculate violations for each test session
    const testSessionsWithViolations = testSessions.map((session) => {
      const violations = calculateViolations(session.events);
      return { ...session, violations };
    });
    // Calculate marks for each test session
    const testSessionsWithMarks = testSessionsWithViolations.map((session) => {
      const marks = calculateMarks(session.answers, session.test.questions);
      return { ...session, marks };
    });

    return res.json({
      testSessions: testSessionsWithMarks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

router.get("/getTestAnalytics/:id", async (req, res) => {
  try {
    const { id: testId } = req.params;
    const testSessions = await prisma.testSession.findMany({
      where: {
        testId: testId,
      },
      include: {
        test: true,
      },
    });

    let totalMarks = 0;
    let totalDuration = 0;

    testSessions.forEach((session) => {
      const marks = calculateMarks(session.answers, session.test.questions);
      totalMarks += marks;
      totalDuration += new Date(session.endTime) - new Date(session.startTime);
    });

    const averageMarks = totalMarks / testSessions.length;
    const averageDuration = (totalDuration / testSessions.length)/ (1000 * 60);;

    return res.json({
      averageMarks,
      averageDuration,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});


// Function to calculate marks for a session
function calculateMarks(answers, questions) {
  let totalMarks = 0;
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id == answer.questionId);
    if (question) {
      const selectedOption = question.options.find(
        (opt) => opt.id == answer.optionId
      );
      console.log(selectedOption);
      if (selectedOption && selectedOption.isCorrect) {
        totalMarks += question.marks;
      }
    }
  });
  return totalMarks;
}

function calculateViolations(events) {
  let violations = 0;
  // return the count where event.severity = "error" or "warning" in the errors array
  events.forEach((event) => {
    if (event.severity === "error" || event.severity === "warning") {
      violations += 1;
    }
  });
  return violations;
}

export default router;
