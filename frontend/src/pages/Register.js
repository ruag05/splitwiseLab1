import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";
const initState = {
  email: "",
  password: "",
};

export default function Register() {
  const auth = React.useContext(authContext).state;
  let history = useHistory();
  const [user, setUser] = useState(initState);
  const alert = useAlert();
  let { dispatch } = useContext(authContext);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log(user);
      const { data } = await axios.post("/users/register", user);
      alert.success("Registeration successful");
      history.push("/login");
    } catch (error) {
      if (error.response) alert.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    if (auth.loggedIn) {
      history.push("/");
    }
  });

  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-4 col-lg-4">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h3 className="login-heading mb-4">Create account</h3>
                  <form onSubmit={handleRegister}>
                    <div className="form-label-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        autofocus
                      />
                      <label for="name">Name</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        autofocus
                      />
                      <label for="inputEmail">Email address</label>
                    </div>

                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputPassword"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                      <label for="inputPassword">Password</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputcPassword"
                        name="cpassword"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                      <label for="inputcPassword">Confirm Password</label>
                    </div>
                    <button
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      type="submit"
                    >
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-md-flex col-lg-4 col-lg-8 bg-image"></div>
      </div>
    </div>
  );
}
