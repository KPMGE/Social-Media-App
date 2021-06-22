import { unlink } from "fs";

import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { HttpError } from "../models/http-error.js";
import { getCoordinatesForAddress } from "../utils/location.js";
import User from "../models/user.js";
import Place from "../models/place.js";

export const getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  // finding place
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  // finding places
  let places;
  try {
    places = await Place.find({ creatorId: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  // creating place
  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creatorId: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await newPlace.save({ session });
    user.places.push(newPlace);

    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { placeId } = req.params;
  const { title, description } = req.body;

  // finding place
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  // check authorization
  if (place.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  // updating title and description
  place.title = title;
  place.description = description;

  // saving it
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlace = async (req, res, next) => {
  const { placeId } = req.params;

  // finding place
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place to delete.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for provided id.", 404);
    return next(error);
  }

  // check authorization

  if (place.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  const imagePath = place.image;

  // deleting it
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await place.remove({ session });
    place.creatorId.places.pull(place);

    await place.creatorId.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      499
    );
    return next(error);
  }

  unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};
