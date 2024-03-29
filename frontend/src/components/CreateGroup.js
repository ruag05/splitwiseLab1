import axios from "axios";
import React, { useState } from "react";
import { useAlert } from "react-alert";
import CreateInvite from "./CreateInvite";
import splitwiselogo from "../images/splitwise-logo.png"

export default function CreateGroup() {
  const [state, setState] = useState({ name: "", photo: null });
  const alert = useAlert();

  const handleCreateGroup = (e) => {
    e.preventDefault();
    let data = new FormData();
    for (let [key, value] of Object.entries(state)) {
      data.append(key, value);
    }
    axios
      .post("/groups/create", data)
      .then((res) => {
        alert.success(res.data.msg);
        setState({ ...res.data.group });
      })
      .catch((err) => {
        if (err.response?.data.errors) {
          err.response?.data.errors.map((e) => alert.error("Error is" + e));
        } else {
          alert.error("Something went wrong");
        }
      });
  };
  return (
    <div className="row">
      <div className="col-md-3" style={{ marginRight: 20 }}>
        <img
          style={{ maxWidth: "270px", height: 280 }}
          src={
            state.photo
              ? typeof state.photo === "string"
                ? `/uploads/${state.photo}`
                : `https://ui-avatars.com/api/?size=256&name=${state.name
                  .split(" ")
                  .join("+")}`
              : splitwiselogo
          }
          alt="profile"
        />
      </div>
      <div className="col-md-7">
        <div>
          <form onSubmit={handleCreateGroup}>
            <h3 className="section-heading" style={{ marginTop: 2 }}>START A NEW GROUP</h3>
            <h5 className="mt-3">My group shall be called...</h5>
            <div className="form-group mb-3">
              <input
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                className="form-control"
                type="text"
                required
                name="name"
                placeholder="Group Name" style={{ fontSize: 22, color: "black" }}
              />
            </div>
            <h5 >My group photo shall be...</h5>
            <input
              onChange={(e) => setState({ ...state, photo: e.target.files[0] })}
              className="form-control"
              type="file"
              name="photo"
              required style={{ border: 0, padding: 0 }}
            />
            <button type="submit" className="btn btn-success" style={{ marginTop: "10px" }}>
              Create Group
          </button>
          </form>
          <hr />
          <CreateInvite />
        </div>
      </div>
    </div>
  );
}
