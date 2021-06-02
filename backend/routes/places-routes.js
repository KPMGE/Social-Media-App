import express from "express";
import {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
} from "../controllers/places-controllers.js";

const router = express.Router();

router.get("/:placeId", getPlaceById);
router.get("/user/:userId", getPlaceByUserId);
router.post("/", createPlace);

export default router;
