import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";

export default function PendingInvites() {
  const [state, setState] = useState([]);
  const [grps, setGrps] = useState([]);
  const history = useHistory();
  const alert = useAlert();
  const handleAccept = (gid) => {
    const inv = state.filter((i) => i.groupId === gid);
    axios
      .post("/groups/acceptInvite", { inviteId: inv[0].id })
      .then((res) => {
        alert.success("Invitation Accepted");
        history.push(`/groups/${inv[0].id}`);
      })
      .catch((err) => {
        alert.error("Somwthing went wrong");
      });
  };

  useEffect(() => {
    axios
      .get("/groups/getInvites")
      .then((res) => {
        setState(res.data.invites);
        res.data.invites.forEach((i) => {
          axios.get(`/groups/${i.groupId}`).then((res) => {
            setGrps((ps) => [...ps, res.data.group]);
          });
        });
      })
      .catch((err) => {});
  }, []);
  return (
    <div className="row">
      <div className="col">
        <h3>Pending Invites</h3>
        <ul>
          {grps.map((g) => {
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
  );
}
