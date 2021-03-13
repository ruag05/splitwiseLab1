import React, { useState, useEffect } from "react";
import PendingInvites from "./PendingInvites";
import axios from "axios";
import { useAlert } from "react-alert";

export default function MyGroups() {
  //   const [state, setState] = useState([]);
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
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <PendingInvites />
        </div>
        <div className="col-md-6">
          <h3>My groups</h3>
          <ul>
            {grps.map((g) => {
              return (
                <li key={g.id} className="mb-4">
                  {g.name}{" "}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
