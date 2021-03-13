import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import logout from "../utils/logout";

export default function Navbar() {
  const auth = useContext(authContext).state;
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-transparent mt-n1">
    <div className="splitwise-icon"></div>
      <Link className="navbar-brand" to="/">
        Splitwise
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ml-auto">
          {auth.loggedIn ? (
            <>
              <li className="nav-item active">
                <Link className="nav-link" to="/Dashboard">
                  Home <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/groups/create">
                  Create Group <span className="sr-only"></span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/groups/invite">
                  Create Invite <span className="sr-only"></span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/groups">
                  My Group <span className="sr-only"></span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item active mt-n2">
                <Link className="nav-link" to="/">
                  <button className="btn btn-danger" onClick={logout}>
                    Logout
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item active">
                <Link className="nav-link" to="/login">
                  <button className="btn btn-primary">Login</button>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/register">
                  <button className="btn btn-secondary">Register</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
