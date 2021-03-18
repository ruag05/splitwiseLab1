import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { timezones } from "../utils/timezones";
import "./Profile.css";
const initState = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  currency: "",
  timezone: "",
  language: "",
};

export default function Profile() {
  const [user, setUser] = useState(initState);
  const [img, setImg] = useState(null);
  const alert = useAlert();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onFileChangeHandler = (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
  };
  const handleImageUpload = (e) => {
    const data = new FormData();
    data.append("photo", img);
    e.preventDefault();
    axios
      .post(`/users/updateProfilePic`, data)
      .then((res) => {
        setUser({ ...user, photo: res.data.photo });
        alert.success("Profile picture Updated");
      })
      .catch((err) => {
        alert.error("could not update profile picture");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};
    for (let [key, value] of Object.entries(user)) {
      data[key] = value;
    }
    axios
      .post(`/users/update`, data)
      .then((res) => {
        alert.success("Updated");
        setUser(res.data.user);
      })
      .catch((err) => {
        if (err.response?.data.errors) {
          err.response?.data.errors.map((e) => alert.error(e.message));
        } else {
          alert.error(err.response?.data.msg);
        }
      });
  };

  const { name, email, phone, photo, currency, timezone, language } = user;

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => {
        setUser(res.data.dataValues);
      })
      .catch((err) => {
        setUser(initState);
        alert.error("Error: " + err.response?.data?.msg);
      });
  }, []);

  return (
    <div className="container-sm">
      <br />
      <h2 className="heading">Your Account</h2>
      <div className="row mt-2" style={{borderTop:'0.2px solid #888'}}>
        <div className="col-md-4 mr-4 mt-3" style={{paddingLeft:100}}>
          <img
            style={{ maxWidth: "270px", height: 280, }}
            src={
              photo
                ? `/uploads/${photo}`
                : `https://ui-avatars.com/api/?size=256&name=${name
                  .split(" ")
                  .join("+")}`
            }
            alt="profile"
          />
          <h5 className="my-2 ml-1">Change your avatar</h5>
          <form onSubmit={handleImageUpload}>
            <input style={{ marginTop: "5px", marginLeft:"4px" }}
              name="photo"
              type="file"
              onChange={onFileChangeHandler}
            />
            <button type="submit" className="btn btn-success" style={{ marginTop: "12px", marginLeft:"4px" }}>
              Update Picture
            </button>
          </form>
        </div>
        <div className="col-md-7 mt-3" >
          <form onSubmit={handleSubmit}>
            <div className="row mt-3">
              <div className="col-md-7 px-4" style={{borderLeft:'0.2px solid #888' }}>
                <h5 htmlFor="name">Your Name</h5>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <h5 htmlFor="email">Your Email</h5>
                <input
                  type="email"
                  className="form-control mb-3"
                  name="email"
                  disabled
                  value={email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <h5 htmlFor="phone">Your Phone</h5>
                <input
                  type="number"
                  className="form-control mb-3"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
              <div className="col-md-5">
                <h5 htmlFor="curr">Your default currency</h5>
                <select
                  name="currency"
                  onChange={handleChange}
                  className="form-control form-select mb-3"
                  id="curr"
                >
                  <option value={currency}>{currency}</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="KWD">KWD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>

                <h5 htmlFor="curr">Your default timezone</h5>
                <select
                  name="timezone"
                  onChange={handleChange}
                  className="form-control form-select mb-3"
                  id="time"
                >
                  <option value={timezone}>{timezone}</option>
                  {timezones.map((t, i) => (
                    <option value={t} key={i}>
                      {t}
                    </option>
                  ))}
                </select>

                <h5 htmlFor="curr">Your default language</h5>
                <select
                  name="language"
                  value={language}
                  onChange={handleChange}
                  className="form-control form-select mb-3"
                  id="lang"
                >
                  <option value={language}>{language}</option>
                  <option value="EN">EN</option>
                  <option value="GBP">GBP</option>
                  <option value="KWD">KWD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="row">
              <button
                type="submit"
                className="btn btn-success ml-auto mr-3">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
