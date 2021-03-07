import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import validate from '../utils/validateInputs.js';

export default function Register() {

  const auth = React.useContext(authContext).state;
  let history = useHistory();
  const alert = useAlert();

  const initState = {
    name: '',
    email: '',
    password: '',
    validationErr: {},
  }
  const [user, setUser] = useState(initState);

  // #region Redux code
  const name1 = useSelector(state => state.name)
  const email1 = useSelector(state => state.email)
  const password1 = useSelector(state => state.password)
  const cpassword1 = useSelector(state => state.cpassword)
  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      console.log("Register.js -> Inside useEffect");
      if (name1 && email1 && password1 && cpassword1) {
        const validationErrors = validate(user);
        const noErrors = Object.keys(validationErrors).length === 0;
        setUser({
          ...user,
          validationErr: validationErrors,
        }
        );
        if (noErrors) {
          console.log("Inputs Validated");
          axios.post('http://localhost:5000/users/register', {
            name: name1, email: email1, password: password1, cpassword: cpassword1
          })
            .then(() => { 
              console.log("Register.js -> Inside Axios->Post->then success")
              alert.success("Registeration successful");
              history.push("/Login");
            }, (error) => {
              console.log("Inside Axios->Post->then fail")
              console.log(error.response.msg);
              if (error.response.status === 400)
                alert.error("User already exists");
            })
        }
        else
          alert.error("Inputs Validation failed");
      }
    }
  }, [name1, email1, password1, cpassword1]);
  //#endregion

  const handleChange = (e) => {
    console.log(`Changed property: ${e.target.name}`);
    setUser(user => ({ ...user, [e.target.name]: e.target.value }));
  };

  const handleRegister = () => {
    try {
      // const { data } = await axios.post("/users/register", user);
      dispatch({
        type: "Register", payload: {
          name: user.name,
          email: user.email,
          password: user.password,
          cpassword: user.cpassword
        }
      })
      //changing it to Login is not working
      //history.push("/Register");
    } catch (error) {
      if (error.response) alert.error(error.response.data.msg);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-4 col-lg-4">
          <div className="login d-flex align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-md-8 mx-auto">
                  <h3 className="login-heading mb-4">Create account</h3>
                  <form >
                    <div className="errorMsg">{user.validationErr.name}</div>
                    <div className="form-label-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        autofocus
                      />
                      <label for="name">Name</label>
                    </div>
                    <div className="errorMsg">{user.validationErr.email}</div>
                    <div className="form-label-group">
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter email-address"
                        required
                        autofocus
                      />
                      <label for="inputEmail">Email address</label>
                    </div>
                    <div className="errorMsg">{user.validationErr.password}</div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputPassword"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Enter Password"
                        required
                      />
                      <label for="inputPassword">Password</label>
                    </div>
                    <div className="errorMsg">{user.validationErr.cpassword}</div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputcPassword"
                        name="cpassword"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                      />
                      <label for="inputcPassword">Confirm Password</label>
                    </div>
                    <button
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      type="button" onClick={handleRegister}>
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