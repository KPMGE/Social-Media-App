import { HttpError } from "../models/http-error.js";
import { v4 as generateUniqueId } from "uuid";

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creatorId: "u1",
  },
];

export const getPlaceById = (req, res, next) => {
  const { placeId } = req.params;

  const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  res.json({ place }); // place: place
};

export const getPlacesByUserId = (req, res, next) => {
  const { userId } = req.params;

  const places = DUMMY_PLACES.find((place) => {
    return place.creatorId === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({ places });
};

export const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creatorId } = req.body;

  const newPlace = {
    id: generateUniqueId(),
    title,
    description,
    location: coordinates,
    address,
    creatorId,
  };

  DUMMY_PLACES.push(newPlace);
  res.status(201).json({ place: newPlace });
};

export const updatePlace = (req, res, next) => {
  const { placeId } = req.params;
  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

export const deletePlace = (req, res, next) => {
  const { placeId } = req.params;
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);

  res.status(200).json({ message: "Deleted place." });
};
