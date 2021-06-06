import { validationResult } from "express-validator";

import { HttpError } from "../models/http-error.js";
import { getCoordinatesForAddress } from "../utils/location.js";
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

  const { title, description, address, creatorId } = req.body;

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
    image: "some http link image",
    creatorId,
  });

  // saving it
  try {
    await newPlace.save();
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
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
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  // deleting it
  try {
    place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};
