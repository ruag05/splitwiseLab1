import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { timezones } from "../utils/timezones";

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
    <br/>
      <h1 className="ml-2">Your Account</h1>
      <div className="row">
        <div className="col-md-4">
          <img
            style={{ maxWidth: "300px" }}
            src={
              photo
                ? `/uploads/${photo}`
                : `https://ui-avatars.com/api/?size=256&name=${name
                    .split(" ")
                    .join("+")}`
            }
            alt="profile"
          />
          <p className="mt-2 ml-0.75">Choose Your Avatar</p>
          <form onSubmit={handleImageUpload}>
            <input            
              name="photo"
              type="file"
              onChange={onFileChangeHandler}             
            />
            <button type="submit" className="btn btn-success ml-auto mr-3 mt-3">
              Update
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8 px-5">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  className="form-control mb-3"
                  name="email"
                  disabled
                  value={email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <label htmlFor="phone">Your Phone</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="curr">Your default currency</label>
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

                <label htmlFor="curr">Your default timezone</label>
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

                <label htmlFor="curr">Your default language</label>
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
                className="btn btn-success ml-auto mr-3 mt-4"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
