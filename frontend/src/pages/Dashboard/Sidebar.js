import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

const LeftNav = () => {
  let friends = ["Naren", "Apoorv", "Manovikas", "Prachal"];

  const [grps, setGrps] = useState([]);
  useEffect(() => {
    axios
      .get("/users/getGroups")
      .then((res) => {
        // setState(res.data.groups);
        res.data.groups.forEach((i) => {
          console.log(i);
          axios.get(`/groups/${i}`).then((res) => {
            setGrps((ps) => [...ps, res.data.group]);
          });
        });
      })
      .catch((err) => { });
  }, []);
  return (
    <nav className="left-nav">
      <NavLink to="/dashboard" className="dashlink" activeClassName="is-active">
        <div className="logoimg2"></div>Dashboard
      </NavLink>
      <NavLink to="/activity" className="dashlink" activeClassName="is-active">
        {" "}
        <span className="mx-2">
          <FontAwesomeIcon icon={faFlag} color="grey" />
        </span>
        Recent Activity
      </NavLink>
      <h1 className="headers">Groups<button className="add-button">+ add</button>
      </h1>
      {grps.map((g) => (
        <p key={g.id} className="each-group">
          <Link className="each-element" to={`/groups/${g.id}`}>
            <span className="mx-2">
              <FontAwesomeIcon icon={faUsers} color="grey" />
            </span>
            {g.name}
          </Link>
        </p>
      ))}
      <h1 className="headers">Friends<button className="add-button">+ add</button>
      </h1>
      {friends.map((friend) => (
        <p className="each-element">
          <span className="mx-2">
            <FontAwesomeIcon icon={faUser} color="grey" />
          </span>
          {friend}
        </p>
      ))}
      <h1 className="headers">Invites Requests</h1>
      <nav className="invitenav">
        <h1 className="invitefriends">Invite Friends to Splicewise</h1>
        <input
          type="text"
          className="emailadd"
          placeholder="Enter an email address"
        />
        <input className="submitemail" type="submit" value="Send invite" />
      </nav>
      <br />
      <div className="buttonflex">
        <a
          href="https://www.linkedin.com/in/ruchir-agarwal-7b2713a7/"
          target="_blank"
          rel="noreferrer"
          className="linkedin"
        >
          Linked <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://github.com/ruchiragarwal/"
          target="_blank"
          rel="noreferrer"
          className="linkedin github"
        >
          Github <i className="fab fa-github"></i>
        </a>
      </div>
    </nav>
  );
};

export default LeftNav;
