import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

const LeftNav = () => {
  let friends = ["Ruchir", "Praveen", "John", "Maria"];
  let usernames = ["Naren", "Amit", "Rahul", "Serena"];
  //   let groups = ["Flat#4209", "SE 273", "Cahill Park"];

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
      .catch((err) => {});
  }, []);
  return (
    <nav className="left-nav">
      <NavLink to="/dashboard" activeClassName="is-active" className="dashlink">
        {" "}
        <div className="logoimg2"></div>Dashboard
      </NavLink>
      <NavLink to="/activity" className="dashlink" activeClassName="is-active">
        {" "}
        <i className="fas fa-flag"></i>Recent Activity
      </NavLink>
      <h1 className="friends">
        Groups
        <button className="add-group-button">+ add</button>
      </h1>
      {grps.map((g) => (
        <p key={g.id}>
          <Link to={`/groups/${g.id}`}>{g.name}</Link>
        </p>
      ))}
      <h1 className="friends">
        Friends
        <button className="add-friend-button">+ add</button>
      </h1>
      {friends}
      <h1 className="friends">Friend Requests</h1>

      <h1 className="friends">All Users</h1>
      {usernames}

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
