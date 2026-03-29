import express from "express";
import { param } from "express-validator";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", authMiddleware, getFavourites);

router.post(
  "/:propertyId",
  [
    authMiddleware,
    param("propertyId").isMongoId().withMessage("Valid property ID is required."),
    validateRequest,
  ],
  addFavourite
);

router.delete(
  "/:propertyId",
  [
    authMiddleware,
    param("propertyId").isMongoId().withMessage("Valid property ID is required."),
    validateRequest,
  ],
  removeFavourite
);

export default router;
