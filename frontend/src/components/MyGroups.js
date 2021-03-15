import React, { useState, useEffect } from "react";
import PendingInvites from "./PendingInvites";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyGroups() {
  const [gList, setGlist] = useState([]);
  const [grps, setGrps] = useState([]);
  useEffect(() => {
    axios
      .get("/users/getGroups")
      .then((res) => {
        // setState(res.data.groups);
        res.data.groups.forEach((i) => {
          axios.get(`/groups/${i}`).then((res) => {
            setGlist((ps) => [...ps, res.data.group]);
            setGrps((ps) => [...ps, res.data.group]);
          });
        });
      })
      .catch((err) => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newList = gList.filter((g) => g.name.includes(e.target.value));
    setGrps([...newList]);
  };

  const handleLeaveGroup = (id) => {
    // console.log(id);\
    axios
      .post("/groups/leave", { groupId: id })
      .then((res) => {
        alert("Group left");
      })
      .catch((err) => {
        alert(err.response.data.errors[0]);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PendingInvites />
        </div>
        <div className="col-md-6">
          <h3>My groups</h3>
          <div className="form-group">
            <input
              onChange={handleSearch}
              className="form-control"
              type="text"
              name="search"
              required
              placeholder="Search By Group Name"
            />
          </div>
          <ul>
            {grps.map((g) => {
              return (
                <li key={g.id} className="mb-4">
                  <Link to={`/groups/${g.id}`}>{g.name}</Link>
                  <button
                    className="btn btn-danger ml-5"
                    onClick={() => handleLeaveGroup(g.id)}
                  >
                    Leave Group
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
