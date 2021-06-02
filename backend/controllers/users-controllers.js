import { v4 as generateUnicId } from "uuid";

import { HttpError } from "../models/http-error.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Kevin Carvalho",
    email: "test@gmail.com",
    password: "12345",
  },
  {
    id: "u2",
    name: "Laura Coelho borges",
    email: "test2@gmail.com",
    password: "abcd",
  },
];

export const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

export const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasAlreadyCreatedUser = DUMMY_USERS.find(
    (user) => user.email === email
  );

  if (hasAlreadyCreatedUser) {
    next(new HttpError("Could not create user, email already exists.", 422));
  }

  const newUser = {
    id: generateUnicId(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  res.json({ message: "Logged in!" });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credientials seem to be wrong.",
      401
    );
  }

  res.json({ message: "Logged in" });
};
