import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux"
import { Redirect } from 'react-router-dom';

const initState = {
  email: '',
  password: '',
  isLoggedIn: false,
  isSubmitted: false,
};

export default function Login() {
  const auth = React.useContext(authContext).state;
  let history = useHistory();
  const [user, setUser] = useState(initState);
  const alert = useAlert();

  const email1 = useSelector(state => state.email)
  const password1 = useSelector(state => state.password)
  const isLoggedIn1 = useSelector(state => state.isLoggedIn)
  const isSubmitted1 = useSelector(state => state.isSubmitted)
  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      console.log("Login.js -> Inside useEffect");
      console.log("___ isLoggedIn1 ____"+isLoggedIn1);
      console.log("____ email1 ____"+email1);
      console.log("____ password1 ____"+password1);
      console.log("____ isSubmitted1 ____"+ isSubmitted1);
      if (email1 && password1 && isSubmitted1) {
        axios.post('http://localhost:5000/users/login', {
          email: email1, password: password1
        }).then((response) => {
          console.log("_____ response.status.msg _______" + response.status);
          // if (response.status === 200) {
            console.log("Login.js -> Inside Axios->Post->success")
            alert.success("Login successful");
            dispatch({
              type: "Login",
              payload: {
                email: user.email,
                password: user.password,
                isLoggedIn: true,
                isSubmitted: true,
              }
            });
            console.log("___isLoggedIn1____"+isLoggedIn1);
            // if (isLoggedIn1)
              history.push("/Home");
          //}
        }, (error) => {
          console.log("Inside Axios->Post->fail")
          if (error.response.status === 403)
            alert.error("Invalid credentials entered");
          else if (error.response.status === 401)
            alert.error("User not found");
        })
      }
    }
  }, [email1, password1, isLoggedIn1, isSubmitted1]);

  const handleChange = (e) => {
    console.log(`Changed property: ${e.target.name}`);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    try {
      dispatch({
        type: "Login", payload: {
          email: user.email,
          password: user.password,
          isLoggedIn: false,
          isSubmitted: true,
        }
      })
      // #region Check Console logs
      //const { data } = await axios.post("/users/login", user);

      //#endregion 

      // dispatch1({ type: "SET_ROLE", payload: data.role });
      // dispatch1({ type: "LOG_IN" });
      // alert.success("Log In successful.");
      // if (data.role === "user") {
      //   history.push("/dashboard");
      // } else if (auth.role === "admin") {
      //   history.push("/admin");
      // }
    } catch (error) {
      if (error.response) alert.error(error.response.data.msg);
    }
  };

  // useEffect(() => {
  //   if (auth.loggedIn) {
  //     history.push("/");
  //   }
  // }, [auth.loggedIn, history]);

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
                  <form >
                    <div className="form-label-group">
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        className="form-control"
                        onBlur={handleChange}
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
                        onBlur={handleChange}
                        placeholder="Password"
                        required
                      />
                      <label for="inputPassword">Password</label>
                    </div>
                    <button
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      type="button" onClick={handleLogin}>Log in
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
