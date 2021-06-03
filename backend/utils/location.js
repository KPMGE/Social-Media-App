import axios from "axios";

import { HttpError } from "../models/http-error.js";

const API_KEY = "put my key here after";

export const getCoordinatesForAddress = async (address) => {
  // provisory solution
  return {
    lat: 40.7484474,
    lng: -73.9871516,
  };

  /*
   * after get my api key, i'll use this code
   *
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
  */
};
