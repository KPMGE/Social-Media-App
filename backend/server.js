import fs from "fs";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import { HttpError } from "./models/http-error.js";

const app = express();

dotenv.config();
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// removing CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// error handling  for routes
app.use((req, res, next) => {
  next(new HttpError("Could not find this route.", 404));
});

// error handling
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nmo85.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.SERVER_PORT || 3000;
console.log(uri);

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to the database!");
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => console.error(err));
