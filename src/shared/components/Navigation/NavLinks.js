import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact={true}>
          ALL USERS
        </NavLink>
      </li>

      <li>
        <NavLink to="/u1/places" exact={true}>
          MY PLACES
        </NavLink>
      </li>

      <li>
        <NavLink to="/places/new" exact={true}>
          ADD PLACE
        </NavLink>
      </li>

      <li>
        <NavLink to="/auth" exact={true}>
          AUTHENTICATE
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
