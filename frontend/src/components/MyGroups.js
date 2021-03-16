import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

export default function MyGroups() {
  const alert = useAlert();
  const [gList, setGlist] = useState([]);
  const [grps, setGrps] = useState([]);
  const [invites, setInvites] = useState([]);
  const [invGrps, setInvGrps] = useState([]);

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

    axios
      .get("/groups/getInvites")
      .then((res) => {
        setInvites(res.data.invites);
        res.data.invites.forEach((i) => {
          axios.get(`/groups/${i.groupId}`).then((res) => {
            setInvGrps((ps) => [...ps, res.data.group]);
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
        setGlist((ps) => []);
        setGrps((ps) => []);
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
        alert.success("Group left");
      })
      .catch((err) => {
        alert.error(err.response?.data?.errors[0]);
      });
  };

  const handleAccept = (gid) => {
    const inv = invites.filter((i) => i.groupId === gid);
    axios
      .post("/groups/acceptInvite", { inviteId: inv[0].id })
      .then((res) => {
        setInvGrps([]);
        setGrps([]);
        alert.success("Invitation Accepted");
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

        axios
          .get("/groups/getInvites")
          .then((res) => {
            setInvites(res.data.invites);
            res.data.invites.forEach((i) => {
              axios.get(`/groups/${i.groupId}`).then((res) => {
                setInvGrps((ps) => [...ps, res.data.group]);
              });
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        alert.error("Somwthing went wrong");
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col">
              <h3>Pending Invites</h3>
              <ul>
                {invGrps.map((g) => {
                  return (
                    <li key={g.id} className="mb-4">
                      {g.name}{" "}
                      <button
                        className="btn btn-success"
                        onClick={() => handleAccept(g.id)}
                      >
                        Accept
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
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
