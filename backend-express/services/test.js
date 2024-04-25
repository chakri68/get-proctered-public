import prisma from "../prisma/prisma.js";

/**
 * @param {string} testId
 * @param {string} userId
 */
export async function checkUserTest(testId, userId) {
  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
  });

  if (!test) {
    return {
      error: "Test not found",
      data: null,
    };
  }

  const userTest = await prisma.testTaker.findFirst({
    where: {
      testId,
      userId,
    },
  });

  if (!userTest) {
    return {
      error: "User cannot take test",
      data: null,
    };
  }

  return { data: userTest, error: null };
}
