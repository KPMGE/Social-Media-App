import express from "express";
import { check } from "express-validator";

import {
  getAllUsers,
  signup,
  login,
} from "../controllers/users-controllers.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

export default router;
