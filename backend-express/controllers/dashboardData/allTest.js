import { Router } from "express";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  // Get all tests
    const tests = await prisma.test.findMany({
      include:{
        TestTaker:true
      }
    });
    return res.json({
        tests,
    });
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

export default router;
