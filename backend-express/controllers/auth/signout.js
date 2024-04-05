import { Router } from "express";
import checkAuth from "../../middleware/auth.js";

const router = Router();

router.use(checkAuth);

router.post("/", async (req, res) => {
  // Remove the auth token cookie
  res.clearCookie("auth-token");

  return res.status(200).json({
    message: `User ${req.user?.email} signed out`,
  });
});

export default router;
