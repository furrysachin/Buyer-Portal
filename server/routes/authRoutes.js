import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters."),
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required."),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
    validateRequest,
  ],
  register
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required."),
    body("password").trim().notEmpty().withMessage("Password is required."),
    validateRequest,
  ],
  login
);

export default router;
