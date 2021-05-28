import React from "react";
import "./UsersList.css";

import UserItem from "./UserItem";

const UsersList = (props) => {
  // if there are no users
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2> No Users Found!</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
