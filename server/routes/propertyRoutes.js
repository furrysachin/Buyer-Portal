import express from "express";
import { body } from "express-validator";
import { getProperties, createProperty } from "../controllers/propertyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", authMiddleware, getProperties);

router.post(
  "/",
  [
    authMiddleware,
    body("seed").optional().isBoolean().withMessage("seed must be a boolean."),
    body("title").optional().isLength({ min: 3 }).withMessage("Title must be at least 3 characters."),
    body("price").optional().isNumeric().withMessage("Price must be numeric."),
    body("image").optional().isURL().withMessage("Image must be a valid URL."),
    body("location").optional().isLength({ min: 2 }).withMessage("Location is required."),
    body("description").optional().isLength({ min: 15 }).withMessage("Description must be at least 15 characters."),
    validateRequest,
  ],
  createProperty
);

export default router;
