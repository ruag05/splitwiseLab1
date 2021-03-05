import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";
const initState = {
  email: "",
  password: "",
};

export default function Login() {
  const auth = React.useContext(authContext).state;
  let history = useHistory();
  const [user, setUser] = useState(initState);
  const alert = useAlert();
  let { dispatch } = useContext(authContext);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/users/login", user);
      dispatch({ type: "SET_ROLE", payload: data.role });
      dispatch({ type: "LOG_IN" });
      alert.success("Log In successful.");
      if (data.role === "user") {
        history.push("/dashboard");
      } else if (auth.role === "admin") {
        history.push("/admin");
      }
    } catch (error) {
      if (error.response) alert.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    if (auth.loggedIn) {
      history.push("/");
    }
  }, [auth.loggedIn, history]);

  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="d-none d-md-flex col-md-4 col-lg-8 bg-image"></div>
        <div className="col-md-8 col-lg-4">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h3 className="login-heading mb-4">Welcome back!</h3>
                  <form onSubmit={handleLogin}>
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
                    <button
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      type="submit">
                      Log in
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}