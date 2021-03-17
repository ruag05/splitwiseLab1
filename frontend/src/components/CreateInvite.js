import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";

export default function CreateInvite() {
  const [emails, setEmails] = useState([]);
  const [gName, setGName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const alert = useAlert();

  let myRef = React.createRef();
  let history = useHistory();

  useEffect(() => {
    axios
      .get("/users/getEmails")
      .then((res) => {
        setEmails(res.data.emails);
      })
      .catch((err) => { });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const newSuggstn = emails.filter((email) => email.match(e.target.value));
    if (!e.target.value) {
      setSuggestions([]);
      return;
    }
    setSuggestions(newSuggstn);
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
    <div >
      <h3 className="section-heading">GROUP MEMBERS</h3>
      <div className="row my-2">
        <div className="col-md-6">
          <h5>Enter Group Name</h5>
        </div>
        <div className="col-md-5">
          <form>
            <input 
              type="search"
              className="form-control"
              onChange={(e) => setGName(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-6">
          <h5>Enter member email to invite</h5>
        </div>
        <div className="col-md-5">
          <form>
            <input ref={myRef}
              type="search"
              className="form-control"
              onChange={handleChange} />
          </form>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6"></div>
        <ul className="center">
          {suggestions.map((s) => (
            <li key={s} className="mb-3 text-left">
              {s}{" "}
              <button
                className="btn btn-success"
                onClick={() => handleInvite(s)}>
                Invite
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
}
