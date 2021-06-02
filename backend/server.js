import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import { HttpError } from "./models/http-error.js";

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// error handling  for routes
app.use((req, res, next) => {
  next(new HttpError("Could not find this route.", 404));
});

// error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
