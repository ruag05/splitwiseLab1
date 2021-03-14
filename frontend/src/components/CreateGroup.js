import axios from "axios";
import React, { useState } from "react";
import { useAlert } from "react-alert";

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
      <div className="col-md-4">
        <img
          style={{ maxWidth: "300px" }}
          src={
            state.photo
              ? `/uploads/${state.photo}`
              : `https://ui-avatars.com/api/?size=256&name=${state.name
                  .split(" ")
                  .join("+")}`
          }
          alt="profile"
        />
      </div>
      <div className="col-md-8">
        <form onSubmit={handleCreateGroup}>
          <h3>Create a new group</h3>
          <div className="form-group mb-4">
            <input
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              className="form-control"
              type="text"
              required
              name="name"
              placeholder="Group Name"
            />
          </div>
          <div className="form-group">
            <input
              onChange={(e) => setState({ ...state, photo: e.target.files[0] })}
              className="form-control"
              type="file"
              name="photo"
              required
              placeholder="Group Name"
            />
          </div>
          <button type="submit" className="btn btn-success">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
