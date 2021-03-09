import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";

export default function CreateInvite() {
  const [emails, setEmails] = useState([]);
  const [gName, setGName] = useState("");
  const [suggestions, setSuggetions] = useState([]);
  const alert = useAlert();
  useEffect(() => {
    axios
      .get("/users/getEmails")
      .then((res) => {
        setEmails(res.data.emails);
      })
      .catch((err) => {});
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const newSug = emails.filter((email) => email.match(e.target.value));
    if (!e.target.value) {
      setSuggetions([]);
      return;
    }
    setSuggetions(newSug);
  };

  const handleInvite = (email) => {
    if (!gName) {
      alert.info("Please enter Group Name first");
      return;
    }
    axios
      .post("/groups/invite", { name: gName, email })
      .then((res) => {
        alert.success(res.data.msg);
      })
      .catch((err) => {
        if (err.response?.data.errors) {
          err.response?.data.errors.map((e) => alert.error(e));
        } else {
          alert.error(err.response?.data.msg);
        }
      });
  };

  return (
    <div className="container">
      <h3>Invite Group Members</h3>
      <div className="row my-2">
        <div className="col-md-3">Enter Group Name</div>
        <div className="col-md-6">
          <form>
            <input
              className="form-control"
              onChange={(e) => setGName(e.target.value)}
            />
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row mt-2">
        <div className="col-md-3">Enter email to invite</div>
        <div className="col-md-6">
          <form>
            <input className="form-control" onChange={handleChange} />
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4"></div>
        <ul className="center">
          {suggestions.map((s) => (
            <li key={s} className="mb-3 text-left">
              {s}{" "}
              <button
                className="btn btn-success"
                onClick={() => handleInvite(s)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
