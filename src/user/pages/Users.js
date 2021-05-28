import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Kevin Carvalho",
      image: "https://avatars.githubusercontent.com/u/46900633?v=4",
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
