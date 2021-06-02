import express from "express";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers.js";

const router = express.Router();

router.get("/:placeId", getPlaceById);
router.get("/user/:userId", getPlacesByUserId);
router.post("/", createPlace);
router.patch("/:placeId", updatePlace);
router.delete("/:placeId", deletePlace);

export default router;
